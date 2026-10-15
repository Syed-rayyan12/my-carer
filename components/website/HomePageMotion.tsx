"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { bannerAnimationSettings, type BannerPage, type RevealSettings, type RevealDirection } from "./bannerAnimationSettings";

type RevealStyle = RevealDirection;

export default function HomePageMotion({ children, animateSections = true, animationPage = "home" }: { children: ReactNode; animateSections?: boolean; animationPage?: BannerPage }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const settings = bannerAnimationSettings[animationPage];
    const animations = new Map<HTMLElement, Animation>();
    const pulseAnimations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        animations.get(target)?.play();
        observer.unobserve(target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

    const reveal = (element: HTMLElement, style: RevealStyle, delay = 0, custom?: RevealSettings) => {
      if (custom && !custom.enabled) return;
      const distance = custom?.distancePx ?? (style === "left" ? 42 : style === "perspective" ? 50 : 36);
      if (animations.has(element)) return;
      const computed = getComputedStyle(element);
      const start: Keyframe = { opacity: 0 };
      const end: Keyframe = { opacity: computed.opacity };
      if (style === "perspective") {
        start.transform = `perspective(900px) translateY(${distance}px) rotateX(24deg) scale(0.95)`;
        end.transform = computed.transform;
      } else {
        start.translate = style === "left" ? `-${distance}px 0px` : style === "right" ? `${distance}px 0px` : style === "fade" ? "0px 0px" : `0px ${distance}px`;
        end.translate = computed.translate === "none" ? "0px 0px" : computed.translate;
        if (style === "scale") {
          start.scale = "0.93";
          end.scale = computed.scale === "none" ? "1" : computed.scale;
        }
      }
      const animation = element.animate([start, end], {
        duration: custom?.durationMs ?? (style === "perspective" ? 1600 : 1300),
        delay,
        easing: settings.easing,
        fill: "both",
      });
      animation.pause();
      animation.currentTime = 0;
      // Release animated properties so edits and existing hover styles keep working.
      animation.onfinish = () => animation.cancel();
      animations.set(element, animation);
      observer.observe(element);
    };

    const revealGroup = (selector: string, animation: RevealSettings, stagger = 0) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => reveal(element, animation.from, animation.delayMs + index * stagger, animation));
    };
    revealGroup(".hero-title", settings.heading);
    revealGroup(".hero-description", settings.paragraph);
    revealGroup(".hero-button", settings.button);
    revealGroup(".hero-phone", settings.phone);
    revealGroup(".hero-visual", settings.image);
    revealGroup(".hero-perspective-card", settings.badges, settings.badgeStaggerMs);

    const badge = root.querySelector<HTMLElement>(".hero-welcome");
    if (badge && settings.welcome.enabled) {
      const pulse = badge.animate([
        { scale: "1", boxShadow: "0 0 0 0 rgba(255,47,104,0)" },
        { scale: String(settings.welcome.scale), boxShadow: "0 0 0 9px rgba(255,47,104,0.09)" },
        { scale: "1", boxShadow: "0 0 0 0 rgba(255,47,104,0)" },
      ], { duration: settings.welcome.durationMs, iterations: Infinity, easing: "ease-in-out" });
      pulseAnimations.push(pulse);
    }

    const cardStyles: RevealStyle[] = ["scale", "bottom", "left", "scale", "bottom"];
    if (animateSections) root.querySelectorAll<HTMLElement>(":scope > section").forEach((section, sectionIndex) => {
      if (section.classList.contains("home-hero")) return;
      section.querySelectorAll<HTMLElement>("h2, p").forEach((element, index) => {
        if (!element.closest("article")) reveal(element, "left", Math.min(index, 2) * 140);
      });
      section.querySelectorAll<HTMLElement>("article").forEach((card, index) => {
        reveal(card, cardStyles[sectionIndex % cardStyles.length], (index % 4) * 150);
      });
      section.querySelectorAll<HTMLElement>("form").forEach(element => reveal(element, "bottom", 200));
    });

    // Keyboard navigation should never land on an invisible offscreen element.
    const showFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const [element, animation] of animations) {
        if (element.contains(event.target)) {
          animation.cancel();
          observer.unobserve(element);
        }
      }
    };
    const stopMotion = () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      pulseAnimations.forEach(animation => animation.cancel());
    };
    root.addEventListener("focusin", showFocused);
    reducedMotion.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      pulseAnimations.forEach(animation => animation.cancel());
      root.removeEventListener("focusin", showFocused);
      reducedMotion.removeEventListener("change", stopMotion);
    };
  }, [animateSections, animationPage]);

  return <main ref={rootRef} className="w-full overflow-hidden">{children}</main>;
}
