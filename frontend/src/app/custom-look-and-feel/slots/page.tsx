import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { CodeBlock, Panel, TryIt } from "@/components/ui";

const ROOT_SLOTS: [string, string][] = [
  ["messageView", "The message list container."],
  ["scrollView", "The scroll container, with feather and scroll-to-bottom."],
  ["input", "The text input area with its send controls."],
  ["suggestionView", "The suggestion pills shown below messages."],
  ["header / toggleButton", "Sidebar and Popup only."],
];

const NESTING = `// Slots nest, so a path can go several levels deep.
<CopilotChat
  messageView={{
    assistantMessage: {
      toolbar: CustomToolbar,
      copyButton: CustomCopyButton,
    },
    userMessage: CustomUserMessage,
  }}
/>

// …and the leaf can be an inline component.
<CopilotChat
  messageView={{
    assistantMessage: {
      copyButton: ({ onClick }) => <button onClick={onClick}>Copy</button>,
    },
  }}
/>

// A children render function replaces the layout outright.
<CopilotChat>
  {({ messageView, input, scrollView, suggestionView }) => (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b font-semibold">My Agent</header>
      {scrollView}
      <div className="border-t p-4">{input}</div>
    </div>
  )}
</CopilotChat>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/slots" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every chat component is assembled from named sub-components — slots —
          each overridable at one of three levels: a Tailwind class string merged
          into the default, an object of props set on the default, or your own
          component replacing it. Slots nest, so{" "}
          <code>messageView.assistantMessage.copyButton</code> is a valid path.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Root slot</th>
                <th className="pb-2 font-medium">What it is</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROOT_SLOTS.map(([slot, desc]) => (
                <tr key={slot}>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {slot}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={["Hello there"]}
            expect="Level 1 tints the message bubbles and outlines the input. Level 2 focuses the input on mount. Level 3 replaces the message list with a plain custom layout."
            fail="The chat looks identical across all three tabs — the slot props are not reaching the component."
          />
        </div>
      </Panel>

      

      <Panel title="Source">
        <SourceCode file="frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Slot forms the demo does not cover"
        description="Also on the doc page. Shown rather than implemented — they are the same three levels applied further down the tree."
      >
        <CodeBlock code={NESTING} language="tsx" filename="Deeper slot paths" />
      </Panel>
    </>
  );
}
