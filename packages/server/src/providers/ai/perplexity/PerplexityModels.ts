// Modelos oficiais Perplexity AI (2025) — https://docs.perplexity.ai/models/model-cards
export const PERPLEXITY_MODELS = [
  'sonar-pro', // Premier search, advanced grounding, follow-ups
  'sonar', // Lightweight, factual queries
  'sonar-deep-research', // Multi-step, expert-level research & synthesis
  'sonar-reasoning-pro', // Premier reasoning, Chain of Thought
  'sonar-reasoning', // Fast, real-time reasoning
  'r1-1776', // Offline, factual, uncensored, sem busca web
] as const;

export type PerplexityModel = (typeof PERPLEXITY_MODELS)[number];
