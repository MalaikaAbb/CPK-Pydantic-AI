"use client";

// The page's "Approve / Cancel example", verbatim. The page prints the
// component without imports or an export; `useInterrupt` is imported and the
// function exported, nothing else.
// https://docs.copilotkit.ai/pydantic-ai/human-in-the-loop/useInterrupt

import { useInterrupt } from "@copilotkit/react-core/v2";

export function ApprovalInterrupt() {
  useInterrupt({
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });
  return null;
}
