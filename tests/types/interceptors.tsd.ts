import { expectType } from 'tsd'

import type { RequestInterceptor, ResponseInterceptor } from '../..'

// Request interceptor must accept info and may return partials or void
const req: RequestInterceptor = (info) => {
  expectType<string>(info.url)
  expectType<RequestInit>(info.init)
  return { init: { ...info.init, headers: { ...(info.init.headers as Record<string, string>), 'x-test': '1' } } }
}

// Response interceptor receives response and cannot change it (void)
const res: ResponseInterceptor = (info) => {
  expectType<Response>(info.response)
  expectType<string>(info.url)
}

expectType<RequestInterceptor>(req)
expectType<ResponseInterceptor>(res)

import { expectType } from 'tsd'

import type { RequestInterceptor, ResponseInterceptor } from '../..'

const reqInterceptor: RequestInterceptor = (info) => {
  expectType<string>(info.url)
  expectType<RequestInit>(info.init)
  return { url: info.url, init: info.init }
}
expectType<RequestInterceptor>(reqInterceptor)

const resInterceptor: ResponseInterceptor = (info) => {
  expectType<Response>(info.response)
  expectType<string>(info.url)
}
expectType<ResponseInterceptor>(resInterceptor)


