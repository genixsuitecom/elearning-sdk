import { expectNotType } from 'tsd'

import type { ExportTemplate, ExportTheme, ExportOptions } from '../..'

declare const tpl: ExportTemplate
declare const theme: ExportTheme
declare const opts: ExportOptions

// Ensure no consumer-facing alias widens to `any`
expectNotType<any>(tpl)
expectNotType<any>(theme)
expectNotType<any>(opts)


