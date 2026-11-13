"""One place to decide which model every agent runs.

The doc pages disagree with each other and with reality. The Quickstart prints
`openai:gpt-4.1-mini`; Tool Rendering and both Shared State pages print
`openai:gpt-5.4-mini`, which is not a model id OpenAI serves — an agent built
with it fails on its first run.

So the id is a variable: the Quickstart's value by default, overridable with
OPENAI_MODEL when you want to test against whatever the docs currently show.

Since 2026-11-11 the Quickstart (and Tool Rendering) print `openai:gpt-6-luna`.
The default here is still `openai:gpt-4.1-mini`: switching it moves every
agent in this package onto an id that has not been checked, so that is left
for a run that can verify it. OPENAI_MODEL=openai:gpt-6-luna runs the doc's id.
"""

import os

MODEL = os.getenv("OPENAI_MODEL", "openai:gpt-4.1-mini")
