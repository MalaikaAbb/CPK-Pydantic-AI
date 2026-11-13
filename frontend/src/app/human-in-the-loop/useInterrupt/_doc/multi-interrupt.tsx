// The page's "Multi-interrupt behavior" fragment, verbatim: a bare
// `useInterrupt({ ... })` call with no component around it. Type-checked,
// never imported or rendered (a hook call at module scope cannot run).
import { useInterrupt } from "@copilotkit/react-core/v2";

useInterrupt({
  render: ({ interrupts, resolve, cancel }) => (
    <ul>
      {interrupts.map((i) => (
        <li key={i.id}>
          {i.message}
          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>
          <button onClick={() => cancel(i.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  ),
});
