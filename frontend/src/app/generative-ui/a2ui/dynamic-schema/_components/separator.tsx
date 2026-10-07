// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/dynamic-schema (bundle: src/app/demos/declarative-gen-ui/_components/separator.tsx).
"use client";

/**
 * ShadCN-flavoured Separator primitive — uses the (already-installed)
 * `@radix-ui/react-separator` accessibility primitive.
 */
import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

export function Separator({
  className = "",
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={`shrink-0 bg-[var(--border)] ${
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px"
      } ${className}`}
      {...props}
    />
  );
}
