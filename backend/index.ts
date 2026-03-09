/**
 * Example Addon — Backend Entry Point
 *
 * Exports the AddonPlugin that OpenTYME's plugin loader picks up.
 * Replace all "example-addon" / "Example" references with your addon name.
 */

import { Router } from 'express';
import type { AddonPlugin, PluginContext } from './types';
import { ExampleService } from './services/example.service';
import { exampleRouter } from './routes';

const router = Router();
let exampleService: ExampleService;

const plugin: AddonPlugin = {
  name: 'example-addon',

  async initialize(context: PluginContext): Promise<void> {
    const { logger, database, ai } = context;

    logger.info('[Example Addon] Initializing backend...');

    // Initialize your service
    exampleService = new ExampleService(database, logger);

    // Register routes using the initialized service
    exampleRouter(router, exampleService, logger);

    // ── AI Integration (optional) ────────────────────────────────────────────
    //
    // Path 1 — Auto: add @swagger JSDoc with operationId to any route handler
    //   → the endpoint becomes an LLM tool automatically. No code needed here.
    //
    // Path 2 — Custom non-HTTP tool:
    // ai.registerTool({
    //   name: 'example_addon_calculate',
    //   description: 'Calculates something. Use when asked about X.',
    //   parameters: {
    //     type: 'object',
    //     properties: {
    //       value: { type: 'number', description: 'Input value' },
    //     },
    //     required: ['value'],
    //   },
    //   execute: async (args) => {
    //     const value = args.value as number;
    //     return { result: value * 2 };
    //   },
    // });
    //
    // Path 3 — System prompt extension (tell the LLM what your addon does):
    // ai.registerSystemPromptExtension(
    //   'example-addon',
    //   'You have tools for X analysis — use example_addon_calculate when asked about X.'
    // );

    logger.info('[Example Addon] Backend initialized');
  },

  routes: router,
};

export default plugin;
