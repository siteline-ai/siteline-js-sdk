import type { PageviewData, SitelineConfig } from './types';
import { SitelineValidationError } from './errors';
import {
  DEFAULT_ENDPOINT,
  DEFAULT_SDK_NAME,
  DEFAULT_SDK_VERSION,
  DEFAULT_INTEGRATION_TYPE,
  WEBSITE_KEY_REGEX,
  LIMITS,
  TIMEOUT_MS,
} from './constants';

export class Siteline {
  private readonly key: string;
  private readonly endpoint: string;
  private readonly debug: boolean;
  private readonly sdk: string;
  private readonly sdkVersion: string;
  private readonly integrationType: string;

  constructor(config: SitelineConfig) {
    if (!config.websiteKey) {
      throw new SitelineValidationError('[Siteline] Missing websiteKey.');
    }
    if (!WEBSITE_KEY_REGEX.test(config.websiteKey)) {
      throw new SitelineValidationError('[Siteline] Invalid websiteKey format.');
    }

    this.key = config.websiteKey;
    this.endpoint = config.endpoint || DEFAULT_ENDPOINT;
    this.debug = config.debug || false;
    this.sdk = config.sdk || DEFAULT_SDK_NAME;
    this.sdkVersion = config.sdkVersion || DEFAULT_SDK_VERSION;
    this.integrationType = config.integrationType || DEFAULT_INTEGRATION_TYPE;

    if (this.debug) {
      console.log('[Siteline] Siteline initialized');
    }
  }

  async track(data: PageviewData): Promise<void> {
    const sanitized = this.sanitize(data);

    try {
      return await this.send(sanitized);
    } catch (err) {
      if (this.debug) {
        const error = err as Error;
        console.error('[Siteline] Track failed:', error.message);
      }
    }
  }

  private sanitize(data: PageviewData): Record<string, unknown> {
    return {
      websiteKey: this.key,
      url: String(data.url).slice(0, LIMITS.URL_MAX_LENGTH),
      method: String(data.method).toUpperCase().slice(0, LIMITS.METHOD_MAX_LENGTH),
      status: Math.max(LIMITS.STATUS_MIN, Math.min(LIMITS.STATUS_MAX, Number(data.status) || 0)),
      duration: Math.max(LIMITS.DURATION_MIN, Math.min(LIMITS.DURATION_MAX, Number(data.duration) || 0)),
      userAgent: data.userAgent ? String(data.userAgent).slice(0, LIMITS.USER_AGENT_MAX_LENGTH) : null,
      ref: data.ref ? String(data.ref).slice(0, LIMITS.REF_MAX_LENGTH) : null,
      ip: data.ip ? String(data.ip).slice(0, LIMITS.IP_MAX_LENGTH) : null,
      integrationType: this.integrationType.slice(0, LIMITS.INTEGRATION_TYPE_MAX_LENGTH),
      sdk: this.sdk.slice(0, LIMITS.SDK_MAX_LENGTH),
      sdkVersion: this.sdkVersion.slice(0, LIMITS.SDK_VERSION_MAX_LENGTH),
    };
  }

  private async send(data: Record<string, unknown>): Promise<void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `${this.sdk}/${this.sdkVersion}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (this.debug) {
        if (res.ok) {
          console.log('[Siteline] Tracked:', data.url, {
            endpoint: this.endpoint,
            sdk: this.sdk,
            sdkVersion: this.sdkVersion,
            integrationType: this.integrationType,
          });
        } else {
          console.error('[Siteline] HTTP error:', res.status);
        }
      }
    } catch (err) {
      if (this.debug) {
        const error = err as Error;
        console.error('[Siteline] Network error:', error.message);
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
