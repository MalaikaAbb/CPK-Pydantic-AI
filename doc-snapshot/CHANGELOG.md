# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-17

### 13:48 UTC — 1 page, highest severity high

**High — Headless UI** · _local snapshot edit, not an upstream change_

`/pydantic-ai/custom-look-and-feel/headless-ui` · route `/custom-look-and-feel/headless-ui` · under “Display messages” · in a `tsx` block

3 code lines changed.

````diff
+ const { agent } = useAgent();
+ const { copilotkit } = useCopilotKit();
+ return (
````
