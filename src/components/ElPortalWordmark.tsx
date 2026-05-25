import React from "react";
import { PortalIcon } from "./PortalIcon";

interface ElPortalWordmarkProps {
  /** Pixel height of the PORTAL letters. Icon scales from this. Default 20. */
  size?: number;
  /** Tailwind color class for the letters. Default 'text-[#f4f6fb]'. */
  textClassName?: string;
  /** Extra classes on the root wrapper. */
  className?: string;
}

/**
 * Canonical PORTAL wordmark. PortalIcon replaces the "O" in PORTAL.
 * Single source of truth for the brand lockup across nav, hero, footer.
 */
export const ElPortalWordmark: React.FC<ElPortalWordmarkProps> = ({
  size = 20,
  textClassName = "text-[#f4f6fb]",
  className = "",
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <span
        className={`font-sans font-black tracking-tighter leading-none ${textClassName}`}
        style={{ fontSize: `${size}px` }}
      >
        P
      </span>
      <span
        className="relative inline-flex items-center justify-center flex-shrink-0 ml-[-0.01em] mr-[-0.05em]"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size}px` }}
      >
        <PortalIcon size={size} />
      </span>
      <span
        className={`font-sans font-black tracking-tighter leading-none ${textClassName}`}
        style={{ fontSize: `${size}px` }}
      >
        RTAL
      </span>
    </div>
  );
};
