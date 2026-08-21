import React from "react";
import { PortalIcon } from "./PortalIcon";

interface ElPortalWordmarkProps {
  /** Pixel height (font-size) of the PORTAL letters. Icon + EL prefix scale from this. Default 24. */
  size?: number;
  /** Show the small "EL" prefix left of PORTAL. Default false. */
  showPrefix?: boolean;
  /** Ambient portal-blue glow behind the icon. Default false. */
  glow?: boolean;
  /** Icon scales up on hover; glow fades in on hover. Default false. */
  hoverable?: boolean;
  /** Tailwind color class for the letters. Default the strong foreground token. */
  textClassName?: string;
  /** Extra classes on the root wrapper. */
  className?: string;
}

/**
 * Canonical ELPORTAL wordmark. The circular PortalIcon stands in for the "O" in
 * PORTAL. Letters are set in the brand display face (Special Gothic Expanded One,
 * via .font-display, uppercase) so the wordmark matches headers and onboarding.
 *
 * The O is sized to the letters' cap height and given the same inter-letter gap
 * as the surrounding glyphs, so it reads as a letter — equal in height and
 * separation — not an icon dropped into the text.
 *
 * Ported from the El Portal app's own `ElPortalWordmark` so the marketing site
 * and the product show the same lockup. Geometry (0.04em tracking, the 0.98 cap
 * ratio, the three negative margins) is carried over unchanged — those values
 * are what make the O read as a letter, and drifting them re-opens the gap this
 * component exists to close. Only the two colour hooks are re-pointed at this
 * project's tokens, since `text-fg` and `bg-data` do not exist here.
 */
export const ElPortalWordmark: React.FC<ElPortalWordmarkProps> = ({
  size = 24,
  showPrefix = false,
  glow = false,
  hoverable = false,
  textClassName = "text-[var(--color-ep-fg-strong)]",
  className = "",
}) => {
  // The PortalIcon's visible circle fills only ~0.78 of its box, so the box is
  // set just under 1em to make the visible circle match the letters' cap height
  // (a hair of overshoot — a circle reads smaller than a flat-topped letter at
  // equal height). Negative margins absorb the box's transparent padding so the
  // O keeps the same optical gap as the letters.
  const capHeight = Math.round(size * 0.98);
  const prefixSize = Math.round(size * 0.5);
  const renderGlow = glow || hoverable;
  const glowOpacity =
    hoverable && !glow
      ? "opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      : "";
  const rootGroup = hoverable ? "group" : "";
  const letter = `font-display uppercase leading-none ${textClassName}`;

  return (
    <div
      className={`inline-flex items-center leading-none select-none ${rootGroup} ${className}`}
      style={{ fontSize: `${size}px`, letterSpacing: "0.04em" }}
    >
      {showPrefix && (
        <span
          className={`${letter} mr-[0.32em]`}
          style={{ fontSize: `${prefixSize}px` }}
        >
          EL
        </span>
      )}
      <span className={letter}>P</span>
      <span
        aria-hidden
        className="relative inline-flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
        style={{
          width: `${capHeight}px`,
          height: `${capHeight}px`,
          // Pull letters in to absorb the icon box's transparent padding,
          // leaving the same optical gap the expanded face uses. The left
          // margin is tighter because P's bowl leaves extra whitespace on
          // its right, so the P→O and O→R gaps read equal.
          marginLeft: "-0.08em",
          marginRight: "-0.05em",
          // Small lift toward the caps' optical centre (caps sit slightly
          // above the line centre). Kept subtle so the O isn't too high.
          marginTop: "-0.03em",
        }}
      >
        {renderGlow && (
          <span
            aria-hidden
            className={`absolute inset-[-25%] bg-[var(--color-ep-accent)]/25 blur-lg rounded-full ${glowOpacity}`}
          />
        )}
        <PortalIcon size={capHeight} />
      </span>
      <span className={letter}>RTAL</span>
    </div>
  );
};
