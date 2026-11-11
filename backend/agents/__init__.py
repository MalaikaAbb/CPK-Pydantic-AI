"""The Pydantic AI agents this harness serves.

One module per agent, and each module holds exactly the agent its doc page
defines — no shared base class, no invented instructions. That mirrors how the
docs present them: every page that needs an agent shows a complete `agent.py`.

── What changed with the new Quickstart ───────────────────────────────────────
Each module used to end in `app = agent.to_ag_ui()`, and `main.py` mounted those
ASGI apps. The Quickstart now builds a Starlette route per agent and calls
`AGUIAdapter.dispatch_request(request, agent=agent)`, so the modules export the
*agent* and `main.py` owns the routing. Two things came out of that:

  - `to_ag_ui()` is deprecated in pydantic-ai-slim 1.107 and removed in 2.0.
    Nothing here emits a deprecation warning any more.
  - Deps are per-request rather than per-process. `build_deps` below is why.

`search_agent` is deliberately absent. See the module docstring in
`search_agent.py`.
"""

from collections.abc import Callable
from typing import Any

from pydantic_ai.agent import AbstractAgent
from pydantic_ai.ui import StateDeps

from . import (
    a2ui_dynamic,
    a2ui_fixed,
    byoc_hashbrown_agent,
    byoc_json_render_agent,
    hitl_agent,
    language_agent,
    my_agent,
    open_gen_ui_advanced_agent,
    open_gen_ui_agent,
    subagents,
    weather_agent,
)


class AgentEntry:
    """One agent, plus how to build its per-request deps.

    `deps_factory` exists because only the `StateDeps` agents take deps (Shared
    State, A2UI Fixed Schema, Sub-Agents). The rest pass `None`, which is what
    `dispatch_request` defaults to.
    """

    def __init__(
        self,
        agent: AbstractAgent,
        deps_factory: Callable[[], Any] | None = None,
    ) -> None:
        self.agent = agent
        self.deps_factory = deps_factory

    def deps(self) -> Any:
        return self.deps_factory() if self.deps_factory else None


# Keyed by the agent id the frontend addresses. These keys become both the route
# path here and the `agents: { … }` keys in the Next.js runtime route, so the two
# sides cannot drift.
AGENTS: dict[str, AgentEntry] = {
    "my_agent": AgentEntry(my_agent.agent),
    "weather_agent": AgentEntry(weather_agent.agent),
    "language_agent": AgentEntry(
        language_agent.agent, language_agent.build_deps
    ),
    # Generative UI. The two `StateDeps` agents come verbatim from the doc's
    # demo bundle, which serves them through its own adapter and never shows
    # how deps are built. A fresh empty state per request is the same thing
    # `language_agent.build_deps` does.
    "a2ui_fixed": AgentEntry(
        a2ui_fixed.agent, lambda: StateDeps(a2ui_fixed.EmptyState())
    ),
    "a2ui_dynamic": AgentEntry(a2ui_dynamic.agent),
    "byoc_json_render": AgentEntry(byoc_json_render_agent.agent),
    "byoc_hashbrown": AgentEntry(byoc_hashbrown_agent.agent),
    "open_gen_ui": AgentEntry(open_gen_ui_agent.agent),
    "open_gen_ui_advanced": AgentEntry(open_gen_ui_advanced_agent.agent),
    # Human in the Loop.
    "hitl_agent": AgentEntry(hitl_agent.agent),
    # Multi-agent.
    "subagents": AgentEntry(
        subagents.agent, lambda: StateDeps(subagents.SubagentsState())
    ),
}

__all__ = ["AGENTS", "AgentEntry"]
