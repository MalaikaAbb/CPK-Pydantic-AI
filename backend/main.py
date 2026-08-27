"""Serves every Pydantic AI agent in this harness over AG-UI.

The Quickstart's shape, extended to more than one agent:

    async def run_agent(request: Request) -> Response:
        return await AGUIAdapter.dispatch_request(request, agent=agent)

    app = Starlette(routes=[Route("/", run_agent, methods=["POST"])])

That is one agent at `POST /`. This harness needs three, because the doc pages
define different ones (a plain chat agent, a tool-calling agent, a `StateDeps`
agent), so the same call is wrapped once per agent and mounted under its id:

    POST /my_agent/        → the Quickstart agent
    POST /weather_agent/   → the Tool Rendering agent
    POST /language_agent/  → the Shared State agent

Those paths line up with the ids in
`frontend/src/app/api/copilotkit/[[...slug]]/route.ts`.

── Why this replaced `to_ag_ui()` ────────────────────────────────────────────
The Quickstart used to end each agent file with `app = agent.to_ag_ui()` and
mount those ASGI apps. `to_ag_ui()` and the whole `pydantic_ai.ag_ui` module are
deprecated in pydantic-ai-slim 1.107 and removed in 2.0; the docs have since
moved to `AGUIAdapter.dispatch_request`, and so has this file. The startup
deprecation warnings this repo used to print are gone with it.

The browser never calls this service — the Next.js runtime route does,
server-to-server. CORS is opened for the dev origin only so you can poke an
endpoint directly with curl while debugging.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# Prefer backend/.env, then fall back to a repo-root .env so a single file at the
# top level also works.
_BACKEND_ENV = Path(__file__).parent / ".env"
_ROOT_ENV = Path(__file__).parent.parent / ".env"
load_dotenv(_BACKEND_ENV)
load_dotenv(_ROOT_ENV, override=False)

from pydantic_ai.ui.ag_ui import AGUIAdapter  # noqa: E402 - must follow load_dotenv
from starlette.applications import Starlette  # noqa: E402
from starlette.middleware import Middleware  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402
from starlette.requests import Request  # noqa: E402
from starlette.responses import JSONResponse, Response  # noqa: E402
from starlette.routing import Route  # noqa: E402

from agents import AGENTS, AgentEntry  # noqa: E402

PORT = int(os.getenv("AGENT_PORT", "8000"))

_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "AGENT_CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if o.strip()
]

if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit(
        "OPENAI_API_KEY is not set.\n"
        f"Create {_BACKEND_ENV} (or a repo-root .env) from .env.example and add your key."
    )


def make_route(entry: AgentEntry):
    """The Quickstart's `run_agent`, closed over one agent.

    A factory rather than a loop variable: closing over the loop variable
    directly would give every route the last agent in the dict.
    """

    async def run_agent(request: Request) -> Response:
        return await AGUIAdapter.dispatch_request(
            request, agent=entry.agent, deps=entry.deps()
        )

    return run_agent


async def health(_request: Request) -> Response:
    """Lets the frontend tell 'agent server down' apart from 'agent errored'."""
    return JSONResponse({"status": "ok", "agents": sorted(AGENTS)})


app = Starlette(
    routes=[
        Route("/health", health, methods=["GET"]),
        *[
            Route(f"/{agent_id}/", make_route(entry), methods=["POST"])
            for agent_id, entry in AGENTS.items()
        ],
    ],
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=_ALLOWED_ORIGINS,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ],
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
