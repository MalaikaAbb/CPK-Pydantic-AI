// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/fixed-schema (bundle: src/app/demos/a2ui-fixed-schema/_components/separator.tsx).
import * as React from "react";

/**
 * ShadCN-style Separator primitive (inline-cloned for this demo).
 * Plain Tailwind classes; uses a div instead of Radix to keep dependencies minimal.
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  className = "",
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  const orientationClasses =
    orientation === "horizontal" ? "h-px w-full" : "h-full w-px";
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`shrink-0 bg-neutral-200 ${orientationClasses} ${className}`}
      {...props}
    />
  );
}
