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
 * render them.
 */
export default function QuickstartLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
