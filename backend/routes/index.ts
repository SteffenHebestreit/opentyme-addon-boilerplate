/**
 * Example Addon Routes
 *
 * Mounted at /api/plugins/example-addon
 */

import { Router, Request, Response } from 'express';
import { ExampleService } from '../services/example.service';
import { PluginLogger } from '../types';

export function exampleRouter(
  router: Router,
  service: ExampleService,
  logger: PluginLogger,
): void {
  router.get('/status', async (_req: Request, res: Response) => {
    try {
      const status = await service.getStatus();
      res.json({ status });
    } catch (error) {
      logger.error('[Example] Status error:', error);
      res.status(500).json({ error: 'Failed to get status' });
    }
  });

  router.get('/data', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.sub || 'anonymous';
      const data = await service.getData(userId);
      res.json({ data });
    } catch (error) {
      logger.error('[Example] Data error:', error);
      res.status(500).json({ error: 'Failed to get data' });
    }
  });

  router.post('/process', async (req: Request, res: Response) => {
    try {
      const { input } = req.body;
      if (!input) {
        return res.status(400).json({ success: false, message: 'Input is required' });
      }
      const userId = (req as any).user?.sub || 'anonymous';
      const result = await service.processData(userId, input);
      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('[Example] Process error:', error);
      res.status(500).json({ success: false, message: 'Processing failed' });
    }
  });
}
