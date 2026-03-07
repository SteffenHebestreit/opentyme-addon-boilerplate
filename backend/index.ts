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
    const { logger, database } = context;

    logger.info('[Example Addon] Initializing backend...');

    // Initialize your service
    exampleService = new ExampleService(database, logger);

    // Register routes using the initialized service
    exampleRouter(router, exampleService, logger);

    logger.info('[Example Addon] Backend initialized');
  },

  routes: router,
};

export default plugin;
