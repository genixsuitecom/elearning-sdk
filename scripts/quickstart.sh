#!/usr/bin/env bash
set -euo pipefail

# GenixSuite eLearning Quickstart (Bash)
# Requirements: curl, jq

BASE="${BASE:-https://app.genixsuite.com}"
CLIENT_ID="${CLIENT_ID:-}"
CLIENT_SECRET="${CLIENT_SECRET:-}"
SCOPE="${SCOPE:-jobs:write jobs:read artifacts:read ingest:write curriculums:write}"
TOKEN="${GENIXSUITE_API_TOKEN:-}"

log() { printf "\n== %s ==\n" "$1"; }
redact() { local s="$1"; local n=${#s}; if (( n <= 6 )); then echo '****'; else echo "${s:0:3}…${s:n-3:3}"; fi }

printf "Base: %s\n" "$BASE"
[[ -n "$CLIENT_ID" ]] && printf "Client ID: %s\n" "$(redact "$CLIENT_ID")"
[[ -n "$CLIENT_SECRET" ]] && printf "Client Secret: %s\n" "$(redact "$CLIENT_SECRET")"
printf "Scopes: %s\n" "$SCOPE"

if [[ -z "$TOKEN" ]]; then
  [[ -n "$CLIENT_ID" && -n "$CLIENT_SECRET" ]] || { echo "Provide CLIENT_ID/CLIENT_SECRET or set GENIXSUITE_API_TOKEN"; exit 1; }
  log "Fetching access token"
  TOKEN=$(curl -s -X POST "$BASE/api/oauth2/token" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&scope=$SCOPE" | jq -r .access_token)
  [[ "$TOKEN" != "null" && -n "$TOKEN" ]] || { echo "Token error"; exit 1; }
fi

IDEMP=$(uuidgen || cat /proc/sys/kernel/random/uuid)

log "Create curriculum"
CURR=$(curl -s -X POST "$BASE/api/v1/curriculums" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Quickstart Curriculum"}' | jq -r .curriculumId)

echo "curriculumId: ${CURR:-<none>}"

log "List curriculums"
curl -s -X GET "$BASE/api/v1/curriculums" -H "Authorization: Bearer $TOKEN" >/dev/null

if [[ -n "$CURR" && "$CURR" != "null" ]]; then
  log "Get curriculum by id"
  curl -s -X GET "$BASE/api/v1/curriculums/$CURR" -H "Authorization: Bearer $TOKEN" >/dev/null
fi

log "Subjects: process (idempotent)"
SUBJECT_BODY='{"subject":{"title":"Quickstart Subject"},"sources":[{"url":"https://clerk.house.gov/committee_info/scsoal.pdf"}],"outputs":["pptx","pdf"]}'
JOB=$(curl -s -X POST "$BASE/api/v1/subjects/process" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H "Idempotency-Key: $IDEMP" \
  -d "$SUBJECT_BODY" | jq -r .jobId)

echo "jobId: $JOB"

log "Exports: create (from subjectId)"
JOB=$(curl -s -X POST "$BASE/api/v1/exports" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"subjectId\":\"$JOB\",\"outputs\":[\"pptx\",\"pdf\"]}" | jq -r .jobId)

echo "export jobId: $JOB"

log "Jobs: status"
curl -s "$BASE/api/v1/jobs/$JOB" -H "Authorization: Bearer $TOKEN" >/dev/null

log "Jobs: cancel (idempotent)"
IDEMP2=$(uuidgen || cat /proc/sys/kernel/random/uuid)
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/v1/jobs/$JOB/cancel" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Idempotency-Key: $IDEMP2" >/dev/null

log "Artifacts: list and optional ETag poll"
ARTS_JSON=$(curl -i -s "$BASE/api/v1/jobs/$JOB/artifacts" -H "Authorization: Bearer $TOKEN")
ETAG=$(printf "%s" "$ARTS_JSON" | awk -F': ' '/^ETag:/ {print $2}' | tr -d '\r')
ARTIFACT=$(printf "%s" "$ARTS_JSON" | sed -n '/\r$/,$p' | tail -n +2 | jq -r .items[0].id)
[[ -n "$ETAG" ]] && curl -s -o /dev/null -w "%{http_code}\n" "$BASE/api/v1/jobs/$JOB/artifacts" -H "Authorization: Bearer $TOKEN" -H "If-None-Match: $ETAG" >/dev/null
[[ -n "$ARTIFACT" && "$ARTIFACT" != "null" ]] && {
  log "Artifact: resolve download URL"
  curl -s "$BASE/api/v1/artifacts/$ARTIFACT" -H "Authorization: Bearer $TOKEN" >/dev/null
}

log "Ingest: presign and register"
SHA=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
UPLOAD=$(curl -s -X POST "$BASE/api/v1/ingest/uploads" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H "Idempotency-Key: $(uuidgen || cat /proc/sys/kernel/random/uuid)" \
  -d "{\"filename\":\"doc.pdf\",\"mimeType\":\"application/pdf\",\"sizeBytes\":123456,\"sha256\":\"$SHA\"}")
SOURCE_ID=$(printf "%s" "$UPLOAD" | jq -r .sourceId)

curl -s -X POST "$BASE/api/v1/ingest/sources" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H "Idempotency-Key: $(uuidgen || cat /proc/sys/kernel/random/uuid)" \
  -d "{\"sourceId\":\"$SOURCE_ID\",\"filename\":\"doc.pdf\",\"mimeType\":\"application/pdf\",\"sizeBytes\":123456,\"sha256\":\"$SHA\"}" >/dev/null

printf "\nDone.\n"

