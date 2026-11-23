// Edit only the block for your page. Each page owns its values; no shared defaults.
// Edit heart position classes directly in each app page banner.
// Timing is in milliseconds: 1000 = 1 second. enabled: false disables that effect.
// Reveal directions: left, right, bottom, scale, fade, perspective.
export type BannerPage = "home" | "about" | "caregivers" | "care-seekers" | "care-homes" | "jobs" | "technology" | "pricing" | "faqs" | "blogs" | "contact" | "terms" | "privacy-policy";
export type RevealDirection = "left" | "right" | "bottom" | "scale" | "fade" | "perspective";
export type RevealSettings = {
  enabled: boolean;
  from: RevealDirection;
  durationMs: number;
  delayMs: number;
  distancePx: number;
};
export type BannerAnimationSettings = {
  heart: { enabled: boolean; sizePx: number; pulseDurationMs: number; pulseScale: number; riseDurationMs: number; riseDistancePx: number; particleDelayMs: number };
  outline: { enabled: boolean; durationMs: number; strokeWidth: number; dashLength: number; gapLength: number };
  welcome: { enabled: boolean; durationMs: number; scale: number };
  heading: RevealSettings;
  paragraph: RevealSettings;
  image: RevealSettings;
  button: RevealSettings;
  phone: RevealSettings;
  badges: RevealSettings;
  badgeStaggerMs: number;
  easing: string;
};

export const bannerAnimationSettings: Record<BannerPage, BannerAnimationSettings> = {
  "home": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "about": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "caregivers": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "care-seekers": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "care-homes": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "jobs": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "technology": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "pricing": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "faqs": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "blogs": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "contact": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "terms": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "privacy-policy": {
    heart: { enabled: true, sizePx: 63, pulseDurationMs: 1600, pulseScale: 1.08, riseDurationMs: 3200, riseDistancePx: 70, particleDelayMs: 800 },
    outline: { enabled: true, durationMs: 12000, strokeWidth: 12, dashLength: 25, gapLength: 75 },
    welcome: { enabled: true, durationMs: 4500, scale: 1.025 },
    heading: { enabled: true, from: "left", durationMs: 1300, delayMs: 120, distancePx: 42 },
    paragraph: { enabled: true, from: "left", durationMs: 1300, delayMs: 300, distancePx: 42 },
    image: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 120, distancePx: 36 },
    button: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 420, distancePx: 36 },
    phone: { enabled: true, from: "bottom", durationMs: 1300, delayMs: 540, distancePx: 36 },
    badges: { enabled: true, from: "perspective", durationMs: 1600, delayMs: 300, distancePx: 50 },
    badgeStaggerMs: 200,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};
