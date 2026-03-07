/**
 * OpenTYME Addon Backend Types
 *
 * These interfaces mirror the types provided by the OpenTYME host.
 */

import { Pool } from 'pg';
import { Application } from 'express';

export interface PluginLogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export interface PluginContext {
  app: Application;
  logger: PluginLogger;
  database: Pool;
}

export interface AddonPlugin {
  name: string;
  initialize(context: PluginContext): Promise<void>;
  routes: import('express').Router;
}
