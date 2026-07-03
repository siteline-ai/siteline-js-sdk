import type { MCPData, PageviewData, SitelineConfig } from './types';
import { SitelineValidationError } from './errors';
import {
  DEFAULT_ENDPOINT,
  DEFAULT_SDK_NAME,
  DEFAULT_SDK_VERSION,
  DEFAULT_INTEGRATION_TYPE,
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
    const payload: Record<string, unknown> = {
      websiteKey: this.key,
      url: String(data.url).slice(0, LIMITS.URL_MAX_LENGTH),
      method: String(data.method).toUpperCase().slice(0, LIMITS.METHOD_MAX_LENGTH),
      status: Math.max(LIMITS.STATUS_MIN, Math.min(LIMITS.STATUS_MAX, Number(data.status) || 0)),
      duration: Math.max(LIMITS.DURATION_MIN, Math.min(LIMITS.DURATION_MAX, Number(data.duration) || 0)),
      userAgent: data.userAgent ? String(data.userAgent).slice(0, LIMITS.USER_AGENT_MAX_LENGTH) : null,
      ref: data.ref ? String(data.ref).slice(0, LIMITS.REF_MAX_LENGTH) : null,
      ip: data.ip ? String(data.ip).slice(0, LIMITS.IP_MAX_LENGTH) : null,
      acceptHeader: data.acceptHeader ? String(data.acceptHeader).slice(0, LIMITS.ACCEPT_HEADER_MAX_LENGTH) : null,
      integrationType: this.integrationType.slice(0, LIMITS.INTEGRATION_TYPE_MAX_LENGTH),
      sdk: this.sdk.slice(0, LIMITS.SDK_MAX_LENGTH),
      sdkVersion: this.sdkVersion.slice(0, LIMITS.SDK_VERSION_MAX_LENGTH),
    };

    if (data.isMcp === true) {
      payload.isMcp = true;
    }

    const mcpPayload = this.sanitizeMCPData(data.mcp);
    if (mcpPayload !== null) {
      payload.mcp = mcpPayload;
    }

    return payload;
  }

  private sanitizeMCPData(mcp: MCPData | null | undefined): Record<string, unknown> | null {
    if (!mcp || typeof mcp !== 'object') {
      return null;
    }

    const payload: Record<string, unknown> = {};

    const method = this.cleanString(mcp.method, LIMITS.MCP_METHOD_MAX_LENGTH);
    if (method !== null) {
      payload.method = method;
    }

    const toolName = this.cleanString(mcp.toolName, LIMITS.MCP_TOOL_NAME_MAX_LENGTH);
    if (toolName !== null) {
      payload.toolName = toolName;
    }

    const clientName = this.cleanString(mcp.clientName, LIMITS.MCP_CLIENT_NAME_MAX_LENGTH);
    if (clientName !== null) {
      payload.clientName = clientName;
    }

    const clientVersion = this.cleanString(mcp.clientVersion, LIMITS.MCP_CLIENT_VERSION_MAX_LENGTH);
    if (clientVersion !== null) {
      payload.clientVersion = clientVersion;
    }

    const protocolVersion = this.cleanString(mcp.protocolVersion, LIMITS.MCP_PROTOCOL_VERSION_MAX_LENGTH);
    if (protocolVersion !== null) {
      payload.protocolVersion = protocolVersion;
    }

    const sessionId = this.cleanString(mcp.sessionId, LIMITS.MCP_SESSION_ID_MAX_LENGTH);
    if (sessionId !== null) {
      payload.sessionId = sessionId;
    }

    const authPrincipalHash = this.cleanString(mcp.authPrincipalHash, LIMITS.MCP_AUTH_PRINCIPAL_HASH_MAX_LENGTH);
    if (authPrincipalHash !== null) {
      payload.authPrincipalHash = authPrincipalHash;
    }

    const jsonrpcErrorCode = this.clampInteger(
      mcp.jsonrpcErrorCode,
      LIMITS.MCP_JSONRPC_ERROR_CODE_MIN,
      LIMITS.MCP_JSONRPC_ERROR_CODE_MAX
    );
    if (jsonrpcErrorCode !== null) {
      payload.jsonrpcErrorCode = jsonrpcErrorCode;
    }

    const transport = this.cleanString(mcp.transport, LIMITS.MCP_TRANSPORT_MAX_LENGTH);
    if (transport !== null) {
      payload.transport = transport;
    }

    const responseBytes = this.clampInteger(
      mcp.responseBytes,
      LIMITS.MCP_RESPONSE_BYTES_MIN,
      LIMITS.MCP_RESPONSE_BYTES_MAX
    );
    if (responseBytes !== null) {
      payload.responseBytes = responseBytes;
    }

    if (Array.isArray(mcp.argKeys)) {
      const argKeys = mcp.argKeys
        .map((value) => this.cleanString(value, LIMITS.MCP_ARG_KEY_MAX_LENGTH))
        .filter((value): value is string => value !== null)
        .slice(0, LIMITS.MCP_ARG_KEYS_MAX_ITEMS);

      if (argKeys.length > 0) {
        payload.argKeys = argKeys;
      }
    }

    if (Object.keys(payload).length === 0) {
      return null;
    }

    return payload;
  }

  private cleanString(value: string | null | undefined, maxLength: number): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    return trimmed.slice(0, maxLength);
  }

  private clampInteger(value: number | null | undefined, min: number, max: number): number | null {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return null;
    }

    const rounded = Math.round(value);
    return Math.max(min, Math.min(max, rounded));
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
