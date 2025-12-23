import { NextResponse } from 'next/server';
import { Siteline } from '@siteline/core';
import { extractIP } from './utils';
import type { SitelineConfig, ProxyFn } from './types';
import { DEFAULT_SDK_NAME, DEFAULT_SDK_VERSION, DEFAULT_INTEGRATION_TYPE, ENV_VARS } from './constants';

let siteline: Siteline | null = null;
let config: SitelineConfig | null = null;
let hasInitialized = false;

const initSiteline = (cfg?: SitelineConfig) => {
  if (hasInitialized) {
    return;
  }

  hasInitialized = true;

  config = {
    websiteKey: cfg?.websiteKey ?? process.env[ENV_VARS.WEBSITE_KEY] ?? '',
    endpoint: cfg?.endpoint ?? process.env[ENV_VARS.ENDPOINT],
    debug: cfg?.debug ?? process.env[ENV_VARS.DEBUG] === 'true',
  };

  if (!config.websiteKey) {
    return console.warn('[Siteline] Missing websiteKey in config or environment');
  }

  siteline = new Siteline({
    websiteKey: config.websiteKey,
    endpoint: config.endpoint,
    debug: config.debug,
    sdk: DEFAULT_SDK_NAME,
    sdkVersion: DEFAULT_SDK_VERSION,
    integrationType: DEFAULT_INTEGRATION_TYPE,
  });
};

export function withSiteline(): ProxyFn;
export function withSiteline(middleware: ProxyFn): ProxyFn;
export function withSiteline(config: SitelineConfig): ProxyFn;
export function withSiteline(config: SitelineConfig, middleware: ProxyFn): ProxyFn;
export function withSiteline(
  configOrMiddleware?: SitelineConfig | ProxyFn,
  middleware?: ProxyFn
): ProxyFn {
  const config = typeof configOrMiddleware === 'function' ? undefined : configOrMiddleware;
  const next = typeof configOrMiddleware === 'function' ? configOrMiddleware : middleware;

  return async (req) => {
    if (!hasInitialized) {
      initSiteline(config);
    }

    const startTime = performance.now();
    const response = next ? await next(req) : NextResponse.next();

    siteline?.track({
      url: req.url,
      method: req.method,
      status: response.status,
      duration: performance.now() - startTime,
      userAgent: req.headers.get('user-agent'),
      ref: req.headers.get('referer'),
      ip: extractIP(req.headers),
    });

    return response;
  };
}