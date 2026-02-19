export const DEFAULT_ENDPOINT = 'https://api.siteline.ai/v1/intake/pageview';
export const DEFAULT_SDK_NAME = '@siteline/js';
export const DEFAULT_SDK_VERSION = '1.0.8';
export const DEFAULT_INTEGRATION_TYPE = 'js';

export const LIMITS = {
  URL_MAX_LENGTH: 2048,
  METHOD_MAX_LENGTH: 10,
  USER_AGENT_MAX_LENGTH: 512,
  REF_MAX_LENGTH: 2048,
  IP_MAX_LENGTH: 45,
  INTEGRATION_TYPE_MAX_LENGTH: 50,
  SDK_MAX_LENGTH: 50,
  SDK_VERSION_MAX_LENGTH: 20,
  STATUS_MIN: 0,
  STATUS_MAX: 999,
  DURATION_MIN: 0,
  DURATION_MAX: 300000,
} as const;

export const TIMEOUT_MS = 5000;
