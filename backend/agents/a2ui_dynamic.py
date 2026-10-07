"""Agent backing the A2UI Dynamic-Schema route.

https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/dynamic-schema

This follows the page's prose default path, not its demo code. Under that path,
`a2ui={{ catalog }}` on the provider is enough: it enables A2UI and
auto-injects the `generate_a2ui` tool, so neither the runtime nor the agent
declares one.

The demo "Code" tab's `src/agents/a2ui_dynamic.py` takes the opt-out path
instead. It binds its own `generate_a2ui` tool, which imports
`build_a2ui_operations_from_tool_call` from a `tools` module that no bundle
publishes. That tool and its helper are left out here, along with the
`StateDeps[EmptyState]` that only the tool used.

Kept from the demo file: the model and `SYSTEM_PROMPT`, word for word. The
prompt already tells the model to call `generate_a2ui` with no arguments and
lists the catalog's component names.
"""

from __future__ import annotations

from textwrap import dedent

from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIResponsesModel

#region agent
# Verbatim from the demo bundle's src/agents/a2ui_dynamic.py.
SYSTEM_PROMPT = dedent(
    """
    You are a demo assistant for Declarative Generative UI (A2UI — Dynamic
    Schema). Whenever a response would benefit from a rich visual — a
    dashboard, status report, KPI summary, card layout, info grid, a
    pie/donut chart of part-of-whole breakdowns, a bar chart comparing
    values across categories, or anything more structured than plain text —
    call `generate_a2ui` to draw it. The registered catalog includes
    `Card`, `StatusBadge`, `Metric`, `InfoRow`, `PrimaryButton`, `PieChart`,
    and `BarChart` (in addition to the basic A2UI primitives). Prefer
    `PieChart` for part-of-whole breakdowns (sales by region, traffic
    sources, portfolio allocation) and `BarChart` for comparisons across
    categories (quarterly revenue, headcount by team, signups per month).
    `generate_a2ui` takes no arguments and handles the rendering
    automatically. Keep chat replies to one short sentence; let the UI do
    the talking.
    """
).strip()

# The demo's constructor minus `deps_type`, which only its own tool needed.
agent = Agent(
    model=OpenAIResponsesModel("gpt-5-mini"),
    system_prompt=SYSTEM_PROMPT,
)
#endregion
