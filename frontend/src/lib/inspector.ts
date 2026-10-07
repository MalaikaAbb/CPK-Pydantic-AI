/**
 * Which provider owns the Inspector on a given route.
 *
 * Two facts about the Inspector drive this file:
 *
 *  1. **It is bound to one core.** Each provider mounts its own Inspector for
 *     its own `CopilotKitCore`. An Inspector on the root provider cannot see
 *     traffic from a `<CopilotKit>` nested inside it, so it shows an empty event
 *     list and looks broken.
 *  2. **Two on one page is fatal.** Both are lit custom elements. Mounting two
 *     sends lit-html into an unbounded assert loop, which Next mirrors to the
 *     dev server. That can take out the tab, the server and the machine.
 *
 * So each page gets exactly one Inspector, attached to the provider its chat
 * runs on. Several demo routes mount their own `<CopilotKit>`, because their doc
 * page does. On those routes the root provider turns its Inspector off and the
 * nested one keeps its own.
 *
 * Note that `CopilotKitProvider` takes `enableInspector`, not `showDevConsole`.
 * Without `false` it is on in every development build.
 */

/**
 * Routes whose page mounts its own `<CopilotKit>`.
 *
 * If you add another nested provider, add its route here. Otherwise the page
 * will mount two Inspectors.
 */
export const NESTED_PROVIDER_ROUTES = [
  "/quickstart/demo-chat",
  "/generative-ui/a2ui/fixed-schema/demo-chat",
  "/generative-ui/a2ui/dynamic-schema/demo-chat",
  "/generative-ui/json-render/demo-chat",
  "/generative-ui/hashbrown/demo-chat",
  "/generative-ui/open-generative-ui/demo-chat",
  "/multi-agent/subagents/demo-chat",
] as const;

/**
 * What the root `CopilotKitProvider` should pass as `enableInspector`.
 *
 * `undefined` keeps the package default: on in development, localhost only.
 * `false` lets a nested provider own the Inspector on this route.
 */
export function rootInspectorSetting(pathname: string | null): false | undefined {
  if (pathname && (NESTED_PROVIDER_ROUTES as readonly string[]).includes(pathname)) {
    return false;
  }
  return undefined;
}
