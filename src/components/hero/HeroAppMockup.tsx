import React from "react";
import Image from "next/image";

/**
 * Hero screenshot — desktop closeup of the El Portal dashboard.
 * Rendered inside the framed wrapper in Hero.tsx (which provides border + shadow + bg).
 *
 * To swap the image, change HERO_IMAGE below. Available candidates in
 * /public/assets/showcase/:
 *   - device-mockup-dashboard-desktop-closeup.png  (1440×1080, default)
 *   - device-mockup-dashboard-desktop.png
 *   - device-mockup-desktop-and-mobile.png
 *   - device-mockup-mobile-pulse-showoff.png
 *   - device-mockup-mobile-pulse-showoff-1.png
 *   - device-mockup-mobile-pulse-showoff-2.png
 *   - device-mockup-mobile-pulse-showoff-3.png
 */
const HERO_IMAGE = {
  src: "/assets/showcase/device-mockup-dashboard-desktop-closeup-dark-spottlight-matte.png",
  width: 1440,
  height: 1080,
  alt: "El Portal dashboard — desktop closeup, spotlight matte",
};

export const HeroAppMockup: React.FC = () => {
  return (
    <Image
      src={HERO_IMAGE.src}
      alt={HERO_IMAGE.alt}
      width={HERO_IMAGE.width}
      height={HERO_IMAGE.height}
      className="mx-auto block w-full h-auto rounded-xl"
      priority
      quality={95}
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1440px"
    />
  );
};
