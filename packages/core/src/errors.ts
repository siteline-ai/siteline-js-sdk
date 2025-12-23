export class SitelineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SitelineError';
  }
}

export class SitelineValidationError extends SitelineError {
  constructor(message: string) {
    super(message);
    this.name = 'SitelineValidationError';
  }
}

export class SitelineTransportError extends SitelineError {
  constructor(message: string) {
    super(message);
    this.name = 'SitelineTransportError';
  }
}