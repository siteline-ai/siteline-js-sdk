import { type NextRequest, NextResponse } from "next/server";
import type { SitelineConfig as SitelineCoreConfig } from '@siteline/core';

export type SitelineConfig = Omit<Partial<SitelineCoreConfig>, 'sdk' | 'sdkVersion' | 'integrationType'>;

export type ProxyFn = (req: NextRequest) => NextResponse | Response | Promise<NextResponse | Response>;
