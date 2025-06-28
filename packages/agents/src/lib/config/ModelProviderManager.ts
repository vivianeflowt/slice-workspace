export type ModelEndpointConfig = {
  url: string;
  host?: string;
};

export class ModelProviderManager {
  private endpoints: Record<string, ModelEndpointConfig>;

  constructor(config: Record<string, ModelEndpointConfig>) {
    this.endpoints = config;
  }

  getEndpoint(modelName: string, opts?: { host?: string }): string | undefined {
    const entry = this.endpoints[modelName];
    if (!entry) return undefined;
    if (opts?.host && entry.host && entry.host !== opts.host) return undefined;
    return entry.url;
  }
}
