// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/json-render (bundle: src/app/demos/declarative-json-render/types.ts).
export interface JsonRenderSpec {
  root: string;
  elements: Record<
    string,
    { type: string; props: Record<string, unknown>; children?: string[] }
  >;
}
