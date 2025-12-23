export type PageviewData = {
  // Request
  url: string;
  method: string;
  userAgent: string | null;
  ref: string | null;
  ip: string | null;
  // Response
  status: number;
  duration: number;
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
