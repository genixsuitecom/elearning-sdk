import { expectType } from 'tsd'

import { ApiError, Schemas } from '../..'

declare const err: ApiError

// ApiError public surface
expectType<string>(err.url)
expectType<number>(err.status)
expectType<string>(err.statusText)
expectType<unknown>(err.body)
expectType<Record<string, string> | undefined>(err.headers)

// Guard to Problem via Schemas.isProblem
const maybe = err.body
if (Schemas.isProblem(maybe)) {
  expectType<Schemas.Problem>(maybe)
}

import { expectType } from 'tsd'

import type { Problem } from '../..'

declare const p: Problem

expectType<number>(p.status)
expectType<string | undefined>(p.type)
expectType<string>(p.title)
expectType<string | undefined>(p.detail)
expectType<string | undefined>(p.instance)
expectType<string | undefined>(p.code)
expectType<string | undefined>(p.correlationId)


