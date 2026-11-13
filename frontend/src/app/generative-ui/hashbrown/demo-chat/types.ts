// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/hashbrown (bundle: src/app/demos/declarative-hashbrown/types.ts).
export const SALES_STAGES = [
  "prospect",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
] as const;

export type SalesStage = (typeof SALES_STAGES)[number];
