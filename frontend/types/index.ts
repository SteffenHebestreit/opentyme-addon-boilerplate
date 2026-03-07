/**
 * OpenTYME Addon Frontend Types
 *
 * These interfaces mirror the types provided by the OpenTYME host.
 */

import React from 'react';

export interface AddonFrontendPlugin {
  name: string;
  /**
   * Routes your addon contributes to the React Router.
   * Addon pages are accessible at the declared `path`.
   * Include a `menuItem` to appear in the top navigation.
   */
  routes?: LoadedRoute[];
  /**
   * Slot components keyed by slot name.
   * Components are injected into matching <Slot name="..."> points in the core UI.
   *
   * For the "settings-tabs" slot, attach a static `tabMeta` property:
   *   MyComponent.tabMeta = { id: 'my-tab', label: 'My Tab', icon: '🔧' }
   */
  slots?: Record<string, React.ComponentType<any>>;
  /** Optional async setup called before the app renders. */
  initialize?: () => Promise<void>;
}

export interface LoadedRoute {
  path: string;
  component: React.ComponentType<any>;
  protected: boolean;
  /**
   * When provided, a link is added to the top navigation bar.
   * `section` groups items conceptually: "main" | "tools" | "admin" | "reports"
   * `order` controls position among other addon items (lower = earlier).
   */
  menuItem?: {
    label: string;
    icon: string;
    section: 'main' | 'tools' | 'admin' | 'reports';
    order?: number;
  };
}

/**
 * Data passed from the core to slot components via props.
 * The available keys depend on which slot you're in — see docs/ADDON_DEVELOPMENT_GUIDE.md.
 */
export interface SlotContext {
  [key: string]: any;
}
