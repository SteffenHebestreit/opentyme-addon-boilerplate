/**
 * Example Button Component
 *
 * A slot component injected into 'expense-form-actions'.
 * Receives form-setter functions from the slot context.
 */

import React from 'react';

interface SlotProps {
  setDescription?: (v: string) => void;
  setAmount?: (v: string) => void;
  setCurrency?: (v: string) => void;
  setCategory?: (v: string) => void;
  setExpenseDate?: (v: string) => void;
  setNotes?: (v: string) => void;
}

const ExampleButton: React.FC<SlotProps> = ({ setDescription, setNotes }) => {
  const handleClick = () => {
    if (setDescription) setDescription('Auto-filled by Example Addon');
    if (setNotes) setNotes('Added via Example Addon button');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-2 w-full rounded-md border border-purple-300 bg-purple-50 px-3 py-2 text-sm text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
    >
      Auto-fill (Example Addon)
    </button>
  );
};

export default ExampleButton;
