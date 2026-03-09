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

export interface CustomToolParameter {
  type: 'string' | 'number' | 'boolean' | 'integer' | 'array' | 'object';
  description?: string;
  enum?: (string | number)[];
  items?: CustomToolParameter;
  properties?: Record<string, CustomToolParameter>;
}

/**
 * AI integration hooks available to addons via context.ai.
 *
 * Three paths to AI integration:
 * 1. Auto: add @swagger JSDoc to route files → HTTP endpoint becomes an LLM tool automatically
 * 2. Custom: call registerTool() for non-HTTP logic (calculations, external services)
 * 3. Prompt: call registerSystemPromptExtension() to tell the LLM what your addon does
 */
export interface AIContext {
  /**
   * Register a custom non-HTTP LLM tool that runs in-process.
   * Call during initialize() — before any AI requests arrive.
   */
  registerTool: (tool: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, CustomToolParameter>;
      required?: string[];
    };
    execute: (args: Record<string, unknown>) => Promise<unknown>;
  }) => void;

  /**
   * Inject context into the LLM system prompt.
   * Use 1–3 sentences. Keep it concise — adds tokens to every conversation.
   */
  registerSystemPromptExtension: (pluginName: string, text: string) => void;
}

export interface PluginContext {
  app: Application;
  logger: PluginLogger;
  database: Pool;
  /** AI integration hooks — always present. Safe to call even without AI configured. */
  ai: AIContext;
}

export interface AddonPlugin {
  name: string;
  initialize(context: PluginContext): Promise<void>;
  routes: import('express').Router;
}
