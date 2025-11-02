// Minimal mock-based check for request/response interceptors
// Run manually with: node --loader ts-node/esm tests/mocks/interceptors.test.ts

import { OpenAPI } from '../../core/OpenAPI.js'
import { request } from '../../core/request.js'

let requestCalled = false
let responseCalled = false

OpenAPI.INTERCEPTORS = {
  request: [({ url, init }) => { requestCalled = !!url && !!init; }],
  response: [() => { responseCalled = true }],
}

// Mock fetch
// @ts-ignore
globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })

await request(OpenAPI, { method: 'GET', url: '/health' })

if (!requestCalled || !responseCalled) {
  throw new Error('Interceptors not invoked as expected')
}

console.log('Interceptors invoked')


