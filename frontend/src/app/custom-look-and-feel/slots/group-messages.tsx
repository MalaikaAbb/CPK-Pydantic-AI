"use client";

/**
 * The Slots page's "Grouping messages into one row" sample, as published.
 *
 * https://docs.copilotkit.ai/pydantic-ai/custom-look-and-feel/slots
 *
 * Two departures, neither of them in the logic:
 *
 *   - `"use client"` above, because this is its own module in an App Router
 *     project. The doc's `page.tsx` leaves that to the reader.
 *   - `agentId="weather_agent"` on the chat. The doc's chat names no agent, so
 *     here it would fall through to `my_agent`, which has no tools — every
 *     message would get its own row and the grouping would never show.
 *     `weather_agent` has `get_weather`, so one prompt asking about several
 *     cities produces a run of tool steps to fold.
 *
 * The doc's `// [!code highlight:18]` marker is docs-site rendering markup and
 * is left out.
 */

//#region group-messages
import { useCallback } from "react";
import {
  CopilotChat,
  messageGroup,
  messageRow,
  type Message,
  type MessageGroupWrapperProps,
  type MessageRow,
} from "@copilotkit/react-core/v2";

// Define wrappers at module level. One created inside groupMessages is a new
// component on every call, so React would remount it each time.
function ToolActivity({
  messages,
  children,
  state,
  setState,
}: MessageGroupWrapperProps<boolean>) {
  const open = state ?? false;
  return (
    <div className="rounded-lg border">
      <button onClick={() => setState(!open)}>
        {messages.length} tool steps {open ? "▾" : "▸"}
      </button>
      {open && children}
    </div>
  );
}

// An assistant message that also carries text stays on its own row, so the
// text (or a card waiting on the user) is never folded into a closed group.
const isToolStep = (m: Message) =>
  m.role === "tool" ||
  (m.role === "assistant" && !!m.toolCalls?.length && !m.content);

export function Chat() {
  const groupMessages = useCallback((messages: Message[]): MessageRow[] => {
    const rows: MessageRow[] = [];
    let run: Message[] = [];
    const flush = () => {
      if (run.length > 0) {
        rows.push(
          messageGroup({ key: run[0].id, messages: run, wrapper: ToolActivity }),
        );
      }
      run = [];
    };
    for (const message of messages) {
      if (isToolStep(message)) run.push(message);
      else {
        flush();
        rows.push(messageRow(message));
      }
    }
    flush();
    return rows;
  }, []);

  return <CopilotChat agentId="weather_agent" messageView={{ groupMessages }} />;
}
//#endregion
