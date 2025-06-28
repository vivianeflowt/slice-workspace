export interface ModelProfile {
  profile: {
    id: string; // UUIDv4
    name: string;
    description: string;
    version: string;
    model: string;
    assignment: string[]; // Ex: ["BACKEND_DEVELOPER", ...]
    categories: string[];
    recommendation: string[];
    url: string; // Link para documentação oficial
    usage_examples: string[];
  };
  infrastructure: {
    device: 'cpu' | 'gpu' | 'tpu' | string;
    cuda_required: boolean;
    min_memory_gb: number;
    min_vram_gb: number;
    min_cores: number;
    memory_limit: string; // Ex: "8GB"
    num_workers: number;
    os_supported: string[]; // Ex: ["linux-debian"]
  };
}
