export const LLM = {
  gemma: {
    class: "gemma",
    model: "google/gemma-4-26B-A4B-it",
    temperature: 0.2,
    maxTokens: 10000,
    infoLink: "https://huggingface.co/google/gemma-4-26B-A4B-it",
    nilAIInstance: process.env.NILAI_API_URL,
  },
} as const;

export const DEFAULT_MODEL_CONFIG = LLM.gemma;
export const DEFAULT_MODEL = DEFAULT_MODEL_CONFIG.model;

export type TLLMName = (typeof LLM)[keyof typeof LLM]["model"];
export const getModelConfig = (model: TLLMName) => {
  return (
    Object.values(LLM).find((m) => m.model === model) || DEFAULT_MODEL_CONFIG
  );
};
