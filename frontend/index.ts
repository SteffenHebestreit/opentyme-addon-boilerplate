/**
 * Frontend Entry Point
 *
 * This file exports the frontend addon plugin that will be loaded by OpenTYME.
 * It defines routes, slot components, and initialization logic.
 */

import ExamplePage from './pages/ExamplePage';
import ExampleButton from './components/ExampleButton';
import { AddonFrontendPlugin } from './types';

// Export the frontend plugin configuration
export const plugin: AddonFrontendPlugin = {
  name: 'example-addon',

  /**
   * Define routes
   * These will be added to the React Router configuration
   */
  routes: [
    {
      path: '/example-addon',
      component: ExamplePage,
      protected: true,
      // Appears in the top navigation bar
      menuItem: {
        label: 'Example',
        icon: 'Sparkles',
        section: 'tools' as const,
        order: 100,
      },
    }
  ],

  /**
   * Define slot components
   * These will be injected into predefined slots in the UI
   */
  slots: {
    'expense-form-actions': ExampleButton,
    // Add more slot components as needed
  },

  /**
   * Initialize the frontend addon
   * Called when the addon is loaded
   */
  async initialize(): Promise<void> {
    console.log('[Example Addon] Frontend initialized');

    // Perform any frontend initialization here
    // e.g., register event listeners, load configuration, etc.
  }
};

// Default export
export default plugin;
