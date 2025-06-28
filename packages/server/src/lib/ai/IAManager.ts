// import { ... } from '../../providers';

// export type IAProvider = DeepSeekProvider | OpenAIProvider | OllammaProvider | PerplexityProvider;

export class IAManager {
  private static instance: IAManager;
  protected data: any[] = [];

  private constructor() {
    //
  }

  public static getInstance(): IAManager {
    if (!IAManager.instance) {
      IAManager.instance = new IAManager();
    }
    return IAManager.instance;
  }

  add(provider: any) {
    this.data.push(provider);
  }

  find(name: string) {
    return this.data.find((provider) => provider.name === name);
  }

  get(name: string) {
    const provider = this.find(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found`);
    }
    return provider;
  }

  list() {
    return this.data;
  }

  remove(name: string) {
    this.data = this.data.filter((provider) => provider.name !== name);
  }

  clear() {
    this.data = [];
  }

  size() {
    return this.data.length;
  }
}
