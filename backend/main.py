"""Serves every Pydantic AI agent in this harness over AG-UI.

The Quickstart runs one agent: `app = agent.to_ag_ui()`, served at the root of
port 8000. That is still what each module in `agents/` does — `to_ag_ui()`
returns an ASGI app with a single `POST /` route.

This harness needs several agents at once, though, because the doc pages define
different ones (a plain chat agent, a tool-calling agent, a `StateDeps` agent).
Rather than change how any of them is built, each app is mounted under its own
path on one Starlette parent:

    POST /my_agent/        → the Quickstart agent
    POST /weather_agent/   → the Tool Rendering agent
    POST /language_agent/  → the Shared State agent

Those paths line up with the ids in `frontend/src/app/api/copilotkit/route.ts`.

The browser never calls this service — the Next.js runtime route does,
server-to-server. CORS is opened for the dev origin only so you can poke an
endpoint directly with curl or the browser devtools while debugging.
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

from starlette.applications import Starlette  # noqa: E402 - must follow load_dotenv
from starlette.middleware import Middleware  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402
from starlette.responses import JSONResponse  # noqa: E402
from starlette.routing import Mount, Route  # noqa: E402

from agents import AGENTS  # noqa: E402

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


async def health(_request):
    """Lets the frontend tell 'agent server down' apart from 'agent errored'."""
    return JSONResponse({"status": "ok", "agents": sorted(AGENTS)})


app = Starlette(
    routes=[
        Route("/health", health, methods=["GET"]),
        *[Mount(f"/{agent_id}", app=agui_app) for agent_id, agui_app in AGENTS.items()],
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
