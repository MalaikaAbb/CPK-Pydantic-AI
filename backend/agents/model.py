"""One place to decide which model every agent runs.

The doc pages disagree with each other and with reality. The Quickstart prints
`openai:gpt-4.1-mini`; Tool Rendering and both Shared State pages print
`openai:gpt-5.4-mini`, which is not a model id OpenAI serves — an agent built
with it fails on its first run.

So the id is a variable: the Quickstart's value by default, overridable with
OPENAI_MODEL when you want to test against whatever the docs currently show.
"""

import os

MODEL = os.getenv("OPENAI_MODEL", "openai:gpt-4.1-mini")
