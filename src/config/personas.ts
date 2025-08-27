export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
}

export const DEFAULT_MODEL = "openai/gpt-oss-20b";

export const personas: Persona[] = [
  {
    id: "personal-assistant",
    name: "Personal Assistant",
    description: "Efficient task and productivity help",
    model: DEFAULT_MODEL,
    systemPrompt:
      process.env.SYSTEM_PROMPT && process.env.PERSONA_PERSONAL_ASSISTANT_PROMPT
        ? `${process.env.SYSTEM_PROMPT} ${process.env.PERSONA_PERSONAL_ASSISTANT_PROMPT}`
        : "You are an efficient personal assistant AI created by Nillion.",
  },
  {
    id: "wellness-assistant",
    name: "Wellness Assistant",
    description: "Compassionate wellness support",
    model: DEFAULT_MODEL,
    systemPrompt:
      process.env.SYSTEM_PROMPT && process.env.PERSONA_AI_THERAPIST_PROMPT
        ? `${process.env.SYSTEM_PROMPT} ${process.env.PERSONA_AI_THERAPIST_PROMPT}`
        : "You are a compassionate AI Wellness Assistant created by Nillion.",
  },
  {
    id: "companion",
    name: "Companion",
    description: "Friendly conversational partner",
    model: DEFAULT_MODEL,
    systemPrompt:
      process.env.SYSTEM_PROMPT && process.env.PERSONA_COMPANION_PROMPT
        ? `${process.env.SYSTEM_PROMPT} ${process.env.PERSONA_COMPANION_PROMPT}`
        : "You are a friendly AI companion created by Nillion.",
  },
];

export const getPersonaById = (id: string): Persona | undefined => {
  return personas.find((persona) => persona.id === id);
};

export const getPersonaPrompt = (id: string): string => {
  const persona = getPersonaById(id);
  return persona?.systemPrompt || personas[0].systemPrompt;
};
