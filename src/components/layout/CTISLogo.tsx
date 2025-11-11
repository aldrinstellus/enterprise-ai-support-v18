'use client';

/**
 * CTIS Logo Component
 *
 * Displays the CTIS (Customer Technology & Information Services) branding
 * with WTC title in the application header/sidebar.
 *
 * V15 Presentation - A/B Testing Version
 */

export const CTISLogo = () => {
  return (
    <div className="flex-shrink-0 px-4 pt-4 pb-2">
      <div className="flex flex-col gap-2">
        {/* WTC Title */}
        <div className="text-center">
          <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">WTC</span>
        </div>

        {/* CTIS Logo Card */}
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-lg">
          {/* CTIS Logo Badge */}
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <span className="text-lg font-bold text-primary">CT</span>
          </div>

          {/* CTIS Text */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground tracking-wide">CTIS</span>
            <span className="text-[10px] text-muted-foreground">Customer Technology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTISLogo;
