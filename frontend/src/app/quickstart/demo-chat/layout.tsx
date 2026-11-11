import { Providers } from "../providers";

/**
 * The Quickstart's `app/layout.tsx` step, scoped to this one route.
 *
 * The doc renders its client `Providers` file from the root layout, because a
 * layout is a server component and cannot import the provider directly. This
 * harness keeps its own provider at the root, which every other route shares.
 * So the Quickstart's provider is mounted here instead, around the Quickstart
 * demo only. It nests inside the root one, so `lib/inspector.ts` turns the root
 * Inspector off on this route.
 *
 * The doc's `<html>` and `<body>` are not repeated here. Only a root layout may
 * render them. Nor are its two stylesheet imports: the page now imports
 * `@copilotkit/react-core/v2/styles.css` and then `./globals.css` in the root
 * layout. This repo's root layout already imports both, in the opposite order
 * (globals first), and that order is left alone because it affects every
 * route. See README §9.25.
 */
export default function QuickstartLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
