"use client";

/**
 * The code samples on the Threads Drawer page, one `#region` each, so the
 * notes page can show each sample next to its tab.
 *
 * Source: https://docs.copilotkit.ai/pydantic-ai/prebuilt-components/copilot-threads-drawer
 *
 * The samples are kept as published. The only edits, each one repeated at its
 * region:
 *
 *  - Each doc sample is `export default function Page()`. A file can only have
 *    one default export, so they are renamed (`SetupPage`, `SidebarPage`,
 *    `NewConversationPage`). The `ControlledChat` and `agentId` snippets are
 *    fragments with no imports and no export; they get `export` and the
 *    imports at the top of this file, nothing else.
 *  - `height: "100dvh"` becomes `"100%"`. The demo frame's header and tab bar
 *    sit above the sample, and at `100dvh` the frame's `overflow: hidden` cuts
 *    off the bottom of the chat, input included. That would be a harness bug,
 *    not the doc's, so it is removed. Nothing else in the layout is changed.
 *
 * The `<CopilotKitProvider>` each sample opens is kept. It nests inside the app's
 * root provider, so this route is listed in `lib/inspector.ts` and the root
 * Inspector stays off here. That provider sends none of the root provider's
 * `x-user-*` headers, so in Intelligence mode `identifyUser` keys these threads
 * to `anonymous`. They are not the threads Headless Threads lists.
 */

import { useState } from "react";
import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotKitProvider,
  CopilotSidebar,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

//#region setup
// "Set up the Threads Drawer". Published sample apart from the two edits above.
// `<CopilotChat>` is a bare flex child here, as in the doc.
export function SetupPage() {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit">
      <CopilotChatConfigurationProvider>
        <div style={{ display: "flex", height: "100%" }}>
          <CopilotThreadsDrawer />
          <CopilotChat />
        </div>
      </CopilotChatConfigurationProvider>
    </CopilotKitProvider>
  );
}
//#endregion

//#region sidebar
// "Use the Drawer with a sidebar chat". Published sample apart from the two
// edits above. The doc never defines `YourMainContent`, so the sample does not
// compile as printed. The stand-in below renders nothing, so it adds nothing
// to the layout.
function YourMainContent() {
  return null;
}

export function SidebarPage() {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit">
      <CopilotChatConfigurationProvider>
        <div style={{ display: "flex", height: "100%" }}>
          <CopilotThreadsDrawer />
          <main style={{ flex: 1 }}>
            <YourMainContent />
            <CopilotSidebar defaultOpen={true} />
          </main>
        </div>
      </CopilotChatConfigurationProvider>
    </CopilotKitProvider>
  );
}
//#endregion

//#region new-conversation
// "Add your own \"New conversation\" button". Published sample apart from the
// two edits above (renamed from `Page`, `100dvh` → `100%`). The doc's
// `// [!code highlight]` markers are docs-site markup and are left out.
function NewConversationButton() {
  const configuration = useCopilotChatConfiguration();

  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()}
    >
      New conversation
    </button>
  );
}

export function NewConversationPage() {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit">
      <CopilotChatConfigurationProvider>
        <div style={{ display: "flex", height: "100%" }}>
          <CopilotThreadsDrawer />
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <header>
              <NewConversationButton />
            </header>
            <CopilotChat />
          </main>
        </div>
      </CopilotChatConfigurationProvider>
    </CopilotKitProvider>
  );
}
//#endregion

//#region hide-drawer-controls
// The page's CSS for "show only your button", verbatim. The demo tab mounts it
// in a <style> next to `NewConversationPage`, so it applies only while that tab
// is open.
export const HIDE_DRAWER_CONTROLS_CSS = `
copilotkit-threads-drawer::part(new-thread-button),
copilotkit-threads-drawer::part(launcher-new-thread) {
  display: none;
}
`;
//#endregion

//#region controlled
// The controlled-thread fragment from the same section. The doc prints it with
// no imports and no provider around it; `useState` is imported above, and it
// runs under the app's root `<CopilotKit>` (agent `default`, the root
// provider's identity headers).
export function ControlledChat() {
  const [threadId, setThreadId] = useState(() => crypto.randomUUID());
  const startNew = () => setThreadId(crypto.randomUUID());

  return (
    <CopilotChatConfigurationProvider threadId={threadId}>
      <CopilotThreadsDrawer
        onThreadSelect={(id) => setThreadId(id)}
        onNewThread={startNew}
      />
      <button type="button" onClick={startNew}>
        New conversation
      </button>
      <CopilotChat />
    </CopilotChatConfigurationProvider>
  );
}
//#endregion

//#region agent-id
// "Which agent's threads the drawer shows": the one-line sample, rendered as
// published under the app's root `<CopilotKit>`. This harness registers no
// `research_agent` on the runtime, so the expected result is an empty list.
// The wrapper function is harness glue; the JSX is the doc's.
export function ResearchAgentDrawer() {
  return <CopilotThreadsDrawer agentId="research_agent" />;
}
//#endregion
