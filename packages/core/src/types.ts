export type MCPData = {
  method?: string | null;
  toolName?: string | null;
  clientName?: string | null;
  clientVersion?: string | null;
  protocolVersion?: string | null;
  sessionId?: string | null;
  authPrincipalHash?: string | null;
  jsonrpcErrorCode?: number | null;
  transport?: string | null;
  responseBytes?: number | null;
  argKeys?: Array<string | null> | null;
}

export type PageviewData = {
  // Request
  url: string;
  method: string;
  userAgent: string | null;
  ref: string | null;
  ip: string | null;
  acceptHeader?: string | null;
  // Response
  status: number;
  duration: number;
  // Optional MCP-specific ingestion data
  isMcp?: boolean;
  mcp?: MCPData | null;
}

export type SitelineConfig = {
  websiteKey: string;
  endpoint?: string;
  debug?: boolean;
  // SDK metadata
  sdk?: string;
  sdkVersion?: string;
  integrationType?: string;
}
