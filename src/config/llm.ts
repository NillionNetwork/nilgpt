export const LLM = {
  gemma: {
    class: "gemma",
    model: "google/gemma-3-27b-it",
    temperature: 0.2,
    maxTokens: 10000,
    infoLink: "https://huggingface.co/google/gemma-3-27b-it",
    nilAIInstance: process.env.NILAI_API_URL,
  },
  gpt: {
    class: "gpt",
    model: "openai/gpt-oss-20b",
    temperature: 0.95,
    maxTokens: 10000,
    infoLink: "https://huggingface.co/openai/gpt-oss-20b",
    nilAIInstance: process.env.NILAI_API_URL,
  },
} as const;

export const DEFAULT_MODEL_CONFIG = LLM.gpt;
export const DEFAULT_MODEL = DEFAULT_MODEL_CONFIG.model;

export type TLLMName = (typeof LLM)[keyof typeof LLM]["model"];
export const getModelConfig = (model: TLLMName) => {
  return (
    Object.values(LLM).find((m) => m.model === model) || DEFAULT_MODEL_CONFIG
  );
};
