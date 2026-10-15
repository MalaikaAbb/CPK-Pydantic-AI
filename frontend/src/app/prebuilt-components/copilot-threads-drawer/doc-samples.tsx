"use client";

/**
 * The two code samples on the Threads Drawer page, one `#region` each, so the
 * notes page can show each sample next to its tab.
 *
 * Source: https://docs.copilotkit.ai/pydantic-ai/prebuilt-components/copilot-threads-drawer
 *
 * The samples are kept as published. The only edits, each one repeated at its
 * region:
 *
 *  - Each doc sample is `export default function Page()`. A file can only have
 *    one default export, so they are renamed (`SetupPage`, `SidebarPage`).
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

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotKitProvider,
  CopilotSidebar,
  CopilotThreadsDrawer,
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
