// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/json-render (bundle: src/app/demos/declarative-json-render/catalog.ts).
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod4";

const dataPoint = z.object({ label: z.string(), value: z.number() });

export const catalog = defineCatalog(schema, {
  components: {
    MetricCard: {
      // @ts-expect-error Doc code kept verbatim: `zod4` (4.6.x) schemas are not the Zod type @json-render/core 0.21 resolves (its own zod peer); TS2322 on toJSONSchema. README §9 #21.
      props: z.object({
        label: z.string(),
        value: z.string(),
        trend: z.string().nullable(),
      }),
      description:
        "A labelled metric (single number) with an optional trend subtitle",
    },
    BarChart: {
      // @ts-expect-error Doc code kept verbatim: `zod4` (4.6.x) schemas are not the Zod type @json-render/core 0.21 resolves (its own zod peer); TS2322 on toJSONSchema. README §9 #21.
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
        data: z.array(dataPoint),
      }),
      description:
        "A vertical bar chart for comparing discrete values side by side",
    },
    PieChart: {
      // @ts-expect-error Doc code kept verbatim: `zod4` (4.6.x) schemas are not the Zod type @json-render/core 0.21 resolves (its own zod peer); TS2322 on toJSONSchema. README §9 #21.
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
        data: z.array(dataPoint),
      }),
      description:
        "A donut-style pie chart for breaking a total down into category slices",
    },
  },
  actions: {},
});
