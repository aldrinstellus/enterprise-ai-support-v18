'use client';

import { ModeSwitcher } from './ModeSwitcher';

/**
 * CTIS Logo Component
 *
 * Displays the CTIS (Customer Technology & Information Services) branding
 * with mode switcher in the application sidebar.
 *
 * V17 Mode Switcher - Government/Project mode toggle
 */

export const CTISLogo = () => {
  return (
    <div className="flex-shrink-0 px-3 pt-3 pb-3 space-y-2">
      {/* CTIS Logo Card */}
      <div className="flex items-center justify-center px-3 py-3 bg-primary/5 border border-primary/10 rounded-md">
        <img
          src="/ctis-logo.png"
          alt="CTIS Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Mode Switcher - Government vs Project */}
      <ModeSwitcher />
    </div>
  );
};

export default CTISLogo;
