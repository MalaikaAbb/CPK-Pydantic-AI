// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/fixed-schema (bundle: src/app/demos/a2ui-fixed-schema/suggestions.ts).
import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export function useA2UIFixedSchemaSuggestions() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Find SFO → JFK",
        message: "Find me a flight from SFO to JFK on United for $289.",
      },
    ],
    available: "always",
  });
}
