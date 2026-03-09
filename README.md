# OpenTYME Addon Boilerplate

Starter template for building addons for [OpenTYME](https://github.com/SteffenHebestreit/opentyme).

## Structure

```
opentyme-addon-boilerplate/
├── addon-manifest.json   # Addon metadata and capabilities declaration
├── backend/
│   ├── index.ts          # Plugin entry point — export default AddonPlugin
│   ├── types/index.ts    # TypeScript types mirroring the OpenTYME host API
│   ├── routes/           # Express route handlers
│   └── services/         # Business logic
├── frontend/
│   ├── index.tsx         # Frontend plugin entry point
│   └── components/       # React components
└── package.json
```

## Getting Started

1. Copy this repo and rename all `example-addon` / `Example` references.
2. Update `addon-manifest.json` with your addon's name, version, and capabilities.
3. Add to your OpenTYME `addons.config.json`:

```json
{
  "addons": [
    {
      "name": "your-addon-name",
      "enabled": true,
      "source": { "type": "local", "path": "./path/to/your-addon" }
    }
  ]
}
```

4. Run `./scripts/install-addons.sh && docker compose up --build`.

## Addon Manifest

```json
{
  "name": "my-addon",
  "displayName": "My Addon",
  "version": "1.0.0",
  "description": "What this addon does.",
  "author": "Your Name",
  "license": "MIT",
  "compatibility": { "opentyme": ">=1.0.0" },
  "backend": {
    "entryPoint": "index.ts",
    "routes": { "prefix": "/api/plugins/my-addon", "file": "index.ts" }
  },
  "frontend": {
    "entryPoint": "index.tsx",
    "routes": [
      {
        "path": "/addons/my-addon",
        "component": "MyAddonPage",
        "menuItem": { "label": "My Addon", "icon": "Plugin", "section": "addons" }
      }
    ],
    "slots": [
      { "name": "expense-form-actions", "component": "MySlotComponent" }
    ]
  }
}
```

## Backend Entry Point

```typescript
const plugin: AddonPlugin = {
  name: 'my-addon',

  async initialize(context: PluginContext): Promise<void> {
    const { database, logger, ai } = context;

    router.get('/data', async (req, res) => {
      const result = await database.query('SELECT ...', [req.user!.id]);
      res.json(result.rows);
    });
  },

  routes: router,
};

export default plugin;
```

Authentication is applied automatically — `req.user` is always populated, no auth middleware needed in addon routes.

## Available Slots

| Slot name | Where it renders | Context passed |
|-----------|-----------------|----------------|
| `expense-form-actions` | Bottom of Add Expense modal | `{ setDescription, setAmount, setCurrency, setCategory, setExpenseDate, setNotes }` |
| `expense-detail-actions` | Bottom of Expense Detail modal | `{ expense, onExpenseUpdated, isEditing }` |
| `dashboard-widgets` | After Recent Invoices on Dashboard | `{ metrics }` |
| `settings-tabs` | Inside Admin → Settings tabs | `{ activeTab }` — expose static `.tabMeta = { id, label, icon }` |
| `ai-chat-actions` | Above AI chat input | `{ onSend, isStreaming }` — call `onSend(text)` to inject a message |

## AI Integration

Three paths — use any combination:

### Path 1 — Auto (zero config)
Add `@swagger` JSDoc with an `operationId` to any route handler. The endpoint becomes an LLM tool automatically on next backend start.

```typescript
/**
 * @swagger
 * /plugins/my-addon/calculate:
 *   post:
 *     operationId: my_addon_calculate
 *     summary: Calculates X. Use when the user asks about X.
 *     ...
 */
router.post('/calculate', handler);
```

### Path 2 — Custom non-HTTP tool
Register in-process logic as an LLM tool during `initialize()`:

```typescript
ai.registerTool({
  name: 'my_addon_calculate',
  description: 'Calculates X. Use when asked about X.',
  parameters: {
    type: 'object',
    properties: {
      value: { type: 'number', description: 'Input value' },
    },
    required: ['value'],
  },
  execute: async (args) => ({ result: (args.value as number) * 2 }),
});
```

### Path 3 — System prompt extension
Tell the LLM what your addon does (1–3 sentences):

```typescript
ai.registerSystemPromptExtension(
  'my-addon',
  'You have tools to calculate X — use my_addon_calculate when the user asks about X.'
);
```
