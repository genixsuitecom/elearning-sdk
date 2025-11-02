import { expectType } from 'tsd'

import { ElearningApiClient } from '../..'

const a = new ElearningApiClient({ baseUrl: 'https://app.genixsuite.com', token: 't' })
expectType<ElearningApiClient>(a)

const b = new ElearningApiClient({
  baseUrl: 'https://app.genixsuite.com',
  token: async () => 't',
  verbose: true,
  validateResponses: true,
})
expectType<ElearningApiClient>(b)

import { expectType } from 'tsd'

import { ElearningApiClient } from '../..'

// Legacy config shape (deprecated but supported)
const client1 = new ElearningApiClient({
  baseUrl: 'https://app.genixsuite.com',
  token: async () => 'token'
})
expectType<ElearningApiClient>(client1)

// New config shape (uppercase OpenAPIConfig-compatible)
const client2 = new ElearningApiClient({
  BASE: 'https://app.genixsuite.com',
  VERSION: '1.0.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: 'token'
})
expectType<ElearningApiClient>(client2)


