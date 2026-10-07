# A2UI fixed schemas

Loaded at import time by `../a2ui_fixed.py`.

| File | Source |
|---|---|
| `flight_schema.json` | Verbatim from the demo "Code" tab of <https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/fixed-schema> (bundle file `src/agents/a2ui_schemas/flight_schema.json`). |
| `booked_schema.json` | **Borrowed from another framework.** The pydantic-ai agent loads this file, but pydantic-ai's demo bundle does not publish it. Without it, `import agents` raises `FileNotFoundError` and every agent in this server goes down. This copy is byte-for-byte the **google-adk** bundle's `src/agents/a2ui_schemas/booked_schema.json`, from the same page under `/google-adk/`. |

`BOOKED_SCHEMA` is never used: the agent keeps it "for future use once action_handlers land". So the borrowed file only needs to exist and parse.
