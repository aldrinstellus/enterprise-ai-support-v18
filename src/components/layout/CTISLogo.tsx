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
    <div className="flex-shrink-0 px-3 pt-3 pb-3">
      {/* Compact CTIS Logo Card with WTC integrated */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-primary/5 border border-primary/10 rounded-md">
        {/* CTIS Logo Badge */}
        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-md flex-shrink-0">
          <span className="text-sm font-bold text-primary">CT</span>
        </div>

        {/* CTIS Text with WTC */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground tracking-wide">CTIS</span>
            <span className="text-[9px] font-semibold text-muted-foreground tracking-wider uppercase">WTC</span>
          </div>
          <span className="text-[9px] text-muted-foreground truncate">Customer Technology</span>
        </div>
      </div>
    </div>
  );
};

export default CTISLogo;
