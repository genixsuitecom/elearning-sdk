param(
  [string]$BASE,
  [string]$CLIENT_ID,
  [string]$CLIENT_SECRET,
  [string]$SCOPE = "jobs:write jobs:read artifacts:read ingest:write curriculums:write",
  [switch]$SkipIngest,
  [switch]$SkipCurriculum
)

if (-not $PSBoundParameters.ContainsKey('BASE')) {
  $BASE = "https://app.genixsuite.com"
}

$ErrorActionPreference = 'Stop'

function Redact([string]$s) {
  if ([string]::IsNullOrEmpty($s)) { return $s }
  if ($s.Length -le 6) { return '****' }
  return ($s.Substring(0,3) + '…' + $s.Substring($s.Length-3))
}

Write-Host "== GenixSuite eLearning Quickstart (PowerShell) ==" -ForegroundColor Cyan
Write-Host "Base: $BASE" -ForegroundColor DarkGray
if ($CLIENT_ID) { Write-Host "Client ID: $(Redact $CLIENT_ID)" -ForegroundColor DarkGray }
if ($CLIENT_SECRET) { Write-Host "Client Secret: $(Redact $CLIENT_SECRET)" -ForegroundColor DarkGray }
Write-Host "Scopes: $SCOPE" -ForegroundColor DarkGray

# Acquire token (prefer env GENIXSUITE_API_TOKEN if present)
if (-not $env:GENIXSUITE_API_TOKEN) {
  if (-not $CLIENT_ID -or -not $CLIENT_SECRET) {
    throw "Provide -CLIENT_ID and -CLIENT_SECRET parameters, or set the GENIXSUITE_API_TOKEN environment variable."
  }
  Write-Host "Fetching access token…" -ForegroundColor Yellow
  $tokenResp = curl -s -X POST "$BASE/api/oauth2/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&scope=$SCOPE" | ConvertFrom-Json
  if (-not $tokenResp.access_token) { throw "Access token error. Check client credentials, scopes, and base URL." }
  $TOKEN = $tokenResp.access_token
} else {
  $TOKEN = $env:GENIXSUITE_API_TOKEN
}

$Headers = @{ Authorization = "Bearer $TOKEN" }
$IDEMP = [guid]::NewGuid().ToString()

function Step($name) { Write-Host "`n== $name ==" -ForegroundColor Cyan }

if (-not $SkipCurriculum) {
  Step "Create curriculum"
  $createCur = curl -s -X POST "$BASE/api/v1/curriculums" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"Quickstart Curriculum"}' | ConvertFrom-Json
  $CURR = $createCur.curriculumId
  if (-not $CURR) { Write-Warning "No curriculumId returned." } else { Write-Host "curriculumId: $CURR" -ForegroundColor Green }

  Step "List curriculums"
  curl -s -X GET "$BASE/api/v1/curriculums" -H "Authorization: Bearer $TOKEN" | Out-Null

  if ($CURR) {
    Step "Get curriculum by id"
    curl -s -X GET "$BASE/api/v1/curriculums/$CURR" -H "Authorization: Bearer $TOKEN" | Out-Null
  }
}

Step "Subjects: process (idempotent)"
$subjectBody = @{ subject = @{ title = "Quickstart Subject" }; sources = @(@{ url = "https://wsd.dli.mt.gov/_docs/business-services/gen-app-additional.pdf" }); outputs = @("pptx","pdf") } | ConvertTo-Json
$proc = curl -s -X POST "$BASE/api/v1/subjects/process" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -H "Idempotency-Key: $IDEMP" -d $subjectBody | ConvertFrom-Json
if (-not $proc.jobId) { throw "processSubject failed. Check scopes (jobs:write) and base URL. Also check .env file or environment variable for GENIXSUITE_SCOPES Scopes: $SCOPE" }
$JOB = $proc.jobId
Write-Host "jobId: $JOB" -ForegroundColor Green

Step "Exports: create (from subjectId)"
$expBody = @{ subjectId = $JOB; outputs = @("pptx","pdf") } | ConvertTo-Json
$exp = curl -s -X POST "$BASE/api/v1/exports" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d $expBody | ConvertFrom-Json
if (-not $exp.jobId) { throw "createExport failed. Check scopes (e.g., jobs:write) and base URL." }
$JOB = $exp.jobId; Write-Host "export jobId: $JOB" -ForegroundColor Green

Step "Jobs: status"
curl -s "$BASE/api/v1/jobs/$JOB" -H "Authorization: Bearer $TOKEN" | Out-Null

Step "Jobs: cancel (idempotent)"
$IDEMP2 = [guid]::NewGuid().ToString()
curl -i -X POST "$BASE/api/v1/jobs/$JOB/cancel" -H "Authorization: Bearer $TOKEN" -H "Idempotency-Key: $IDEMP2" | Out-Null

Step "Artifacts: list and optional ETag poll"
$arts = curl -s "$BASE/api/v1/jobs/$JOB/artifacts" -H "Authorization: Bearer $TOKEN" | ConvertFrom-Json
if ($arts.items.Count -gt 0) {
  $ARTIFACT = $arts.items[0].id
  Write-Host "artifactId: $ARTIFACT" -ForegroundColor Green
  $ETAG = (curl -sI "$BASE/api/v1/jobs/$JOB/artifacts" -H "Authorization: Bearer $TOKEN" | Select-String '^ETag:' | ForEach-Object { $_.Line.Split(':',2)[1].Trim() })
  if ($ETAG) {
    curl -i "$BASE/api/v1/jobs/$JOB/artifacts" -H "Authorization: Bearer $TOKEN" -H "If-None-Match: $ETAG" | Out-Null
  }
  Step "Artifact: resolve download URL"
  curl -s "$BASE/api/v1/artifacts/$ARTIFACT" -H "Authorization: Bearer $TOKEN" | Out-Null
}

if (-not $SkipIngest) {
  Step "Ingest: presign upload"
  $sha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  $upBody = @{ filename = "doc.pdf"; mimeType = "application/pdf"; sizeBytes = 123456; sha256 = $sha } | ConvertTo-Json
  $IDEMP3 = [guid]::NewGuid().ToString()
  $upload = curl -s -X POST "$BASE/api/v1/ingest/uploads" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -H "Idempotency-Key: $IDEMP3" -d $upBody | ConvertFrom-Json
  $S3URL = $upload.uploadUrl; $FIELDS = $upload.fields; $SOURCE_ID = $upload.sourceId
  if ($S3URL -and $FIELDS -and $SOURCE_ID) { Write-Host "sourceId: $SOURCE_ID" -ForegroundColor Green } else { Write-Warning "Presign did not return expected fields." }

  Step "Ingest: register source"
  $regBody = @{ sourceId = $SOURCE_ID; filename = "doc.pdf"; mimeType = "application/pdf"; sizeBytes = 123456; sha256 = $sha } | ConvertTo-Json
  $IDEMP4 = [guid]::NewGuid().ToString()
  curl -s -X POST "$BASE/api/v1/ingest/sources" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -H "Idempotency-Key: $IDEMP4" -d $regBody | Out-Null
}

Write-Host "`nDone." -ForegroundColor Green
