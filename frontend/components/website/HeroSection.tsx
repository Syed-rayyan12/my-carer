"use client";

import Link from "next/link";
import { CheckCheckIcon, Phone, Shield } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { bannerAnimationSettings, type BannerPage } from "./bannerAnimationSettings";

function useEdgePath(src: string, gap = 16) {
  const [edge, setEdge] = useState({ d: "", w: 1209, h: 1290 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const px = ctx.getImageData(0, 0, w, h).data;

      const solid = (x: number, y: number) => {
        const xi = Math.round(x), yi = Math.round(y);
        if (xi < 0 || yi < 0 || xi >= w || yi >= h) return false;
        const i = (yi * w + xi) * 4;
        if (px[i + 3] < 128) return false;
        const r = px[i], g = px[i + 1], b = px[i + 2];
        return !(r > 230 && g < 90 && b > 70 && b < 150); // image me baked pink line ko ignore
      };

      let sx = 0, sy = 0, n = 0;
      for (let y = 0; y < h; y += 6)
        for (let x = 0; x < w; x += 6)
          if (solid(x, y)) { sx += x; sy += y; n++; }
      if (!n) return;
      const cx = sx / n, cy = sy / n, maxR = Math.hypot(w, h);

      const N = 720;
      const pts: [number, number][] = [];
      for (let k = 0; k < N; k++) {
        const a = -Math.PI / 2 + (2 * Math.PI * k) / N; // top se clockwise
        const dx = Math.cos(a), dy = Math.sin(a);
        let r = maxR;
        while (r > 0 && !solid(cx + dx * r, cy + dy * r)) r -= 1;
        pts.push([cx + dx * r, cy + dy * r]);
      }

      const W = 4;
      const sm = pts.map((_, i) => {
        let x = 0, y = 0;
        for (let j = -W; j <= W; j++) { const p = pts[(i + j + N) % N]; x += p[0]; y += p[1]; }
        return [x / (2 * W + 1), y / (2 * W + 1)] as [number, number];
      });

      const out = sm.map((p, i) => {
        const a = sm[(i - 1 + N) % N], b = sm[(i + 1) % N];
        const tx = b[0] - a[0], ty = b[1] - a[1];
        const l = Math.hypot(tx, ty) || 1;
        return [p[0] + (ty / l) * gap, p[1] - (tx / l) * gap]; // edge se bahar gap px
      });

      setEdge({ d: "M" + out.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" L") + " Z", w, h });
    };
    img.src = src;
  }, [src, gap]);

  return edge;
}

export default function HeroSection({ variant = "home", label, title, description, action, heart, withSearch = variant === "home", animationPage = variant === "about" ? "about" : "home" }: {
  heart: ReactNode;
  withSearch?: boolean;
  variant?: "home" | "about" | "page";
  animationPage?: BannerPage;
  label?: string;
  title?: string;
  description?: string;
  heartAfter?: string;
  action?: { label: string; href: string };
}) {
  const edge = useEdgePath("/images/home-hero.png", 6);
  const settings = bannerAnimationSettings[animationPage];
  const animationVariables = {
    "--hero-heart-particle-delay": `${settings.heart.particleDelayMs}ms`,
    "--hero-heart-size": `${settings.heart.sizePx}px`,
    "--hero-heart-pulse-scale": settings.heart.pulseScale,
    "--hero-heart-pulse-duration": `${settings.heart.pulseDurationMs}ms`,
    "--hero-heart-rise-duration": `${settings.heart.riseDurationMs}ms`,
    "--hero-heart-rise-distance": `${settings.heart.riseDistancePx}px`,
    "--hero-outline-duration": `${settings.outline.durationMs}ms`,
    "--hero-outline-width": settings.outline.strokeWidth,
    "--hero-outline-dashes": `${settings.outline.dashLength} ${settings.outline.gapLength}`,
    "--hero-outline-offset": settings.outline.dashLength + settings.outline.gapLength,
    "--hero-outline-animation": settings.outline.enabled ? "heroSnake" : "none",
  } as CSSProperties;

  return (<section style={animationVariables} className={["home-hero flex items-center max-[1024px]:block max-[1024px]:min-h-[auto] relative min-h-[650px] bg-[#fff1f4]", withSearch ? "min-[1025px]:py-20" : "min-[1025px]:py-12"].join(" ")}>

    <div  className="max-[1050px]:w-[calc(100%_-_40px)] max-[1024px]:min-h-[auto] max-[1024px]:grid-cols-[1fr] max-[1024px]:pt-4 max-[520px]:w-[calc(100%_-_30px)] w-full max-w-[90%] m-[0_auto]">
      <div className="flex items-center justify-between gap-8 max-[1024px]:gap-0 max-[1024px]:flex-col">
        <div  className="max-[1024px]:w-full max-[1024px]:p-[104px_0_0] max-[1024px]:text-center relative z-[5] flex min-w-0 flex-col items-start p-[70px_0] max-[1024px]:items-center">

          <span className="hero-welcome inline-flex items-center mb-[15px] p-[7px_11px] text-[#101929] border border-[#FF2F68] rounded-[3px] text-[14px] font-normal font-nunito leading-[1] uppercase">
            {label ?? (variant === "about" ? "About us" : "WELCOME TO MY CARER")}
          </span>

          <h1 style={{ gridTemplateColumns: settings.heart.enabled ? `minmax(0,1fr) ${settings.heart.sizePx + 56}px` : "minmax(0,1fr)" }} className="hero-title max-[1024px]:block max-[1024px]:static relative mb-5 grid w-full max-w-[660px] grid-cols-[minmax(0,1fr)_119px] items-start font-commissioner text-[54px] font-bold leading-[1.02] tracking-[-2px] text-[#101929] max-[1024px]:text-[46px] max-[520px]:text-[32px] max-[520px]:tracking-[-1px]">
            <span className="min-w-0 break-words">{variant === "home" ? "Find Trusted Caregivers Near You" : (title ?? "About My Carer")}</span>
            {settings.heart.enabled ? heart : null}
          </h1>

          <p className={["hero-description max-w-[610px] m-[0_0_28px] text-[#46505e] leading-[1.75] max-[1024px]:ml-[auto] max-[1024px]:mr-[auto] max-[1024px]:text-[14px] max-[520px]:text-[15px] font-nunito font-medium text-[18px]", variant !== "home" && !action ? "max-[1024px]:mb-0" : ""].join(" ")}>
            {description ?? "Find qualified, verified caregivers in your local area. Whether you need specialist care, companionship or everyday support, My Carer helps you find the right person for your needs."}
          </p>

          {variant === "home" && (
          <div  className="max-[1024px]:justify-center max-[520px]:flex-col flex items-center gap-[12px]">

            <Link href="#find-care" className="hero-button hover:bg-[#e92359] hover:transform-[translateY(-2px)] min-h-[44px] p-[0_19px] inline-flex items-center justify-center gap-[8px] text-[#fff] bg-[#ff2f68] rounded-[3.6px] text-[16px] font-normal [transition:0.2s_ease] font-nunito">
              Browse Caregivers
             
            </Link>

            <div className="hero-phone flex items-center gap-[9px]">
              <div  className="w-[44px] h-[44px] flex items-center justify-center rounded-[50%] border-1 border-white bg-[#101929] text-[#fff]">
                <Phone size={15} className="text-white" />
              </div>

              <div>
                <span className="block text-[#606060] leading-[1.2] font-nunito font-medium text-[14.4px]">Call Us</span>
                <strong className="block text-[#101929] font-nunito font-bold text-[16.2px]">123-456-7890</strong>
              </div>
            </div>

          </div>
          )}
          {variant !== "home" && action && <Link href={action.href} className="hero-button inline-flex min-h-11 items-center rounded-[5px] bg-[#ff2f68] px-5 font-nunito text-[14px] font-medium text-white transition-colors hover:bg-[#e92359]">{action.label}</Link>}

        </div>

        <div style={{ aspectRatio: `${edge.w} / ${edge.h}` }} className={["hero-visual max-[1024px]:mt-10 relative aspect-[1209/1290] w-[488px] max-w-full shrink-0 self-center max-[1024px]:mx-auto max-[1024px]:w-full max-[1024px]:max-w-[430px] max-[1024px]:self-center", withSearch ? "max-[1024px]:mb-[89px] max-[768px]:mb-20" : "max-[1024px]:mb-10"].join(" ")}>

          <style>{`
            .hero-snake {
              fill: none;
              stroke: #ff2f68;
              stroke-width: var(--hero-outline-width);
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: var(--hero-outline-dashes);
              animation: var(--hero-outline-animation) var(--hero-outline-duration) linear infinite;
            }
            @media (prefers-reduced-motion: reduce) { .hero-snake { animation: none; } }
            @keyframes heroSnake {
              from { stroke-dashoffset: var(--hero-outline-offset); }
              to   { stroke-dashoffset: 0; }
            }
          `}</style>

          <img className="relative z-[2] block h-full w-full object-contain" src="/images/home-hero.png" alt="Verified caregiver helping an elderly woman" />

          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full max-w-none overflow-visible pointer-events-none z-[3]"
            viewBox={`0 0 ${edge.w} ${edge.h}`}
            preserveAspectRatio="xMidYMax meet"
          >
            {edge.d && <path className="hero-snake" pathLength={100} d={edge.d} />}
          </svg>

          {variant === "home" && (<>
          <div className="hero-perspective-card max-[520px]:scale-[0.8] max-[520px]:max-w-[200px] origin-bottom flex flex-col absolute z-10 top-8 bg-white rounded-[10px] px-4 py-2 w-fit gap-1">
            <Shield className="text-[#FF2F68]"/>
            <h2 className="font-commissioner font-bold text-[16.6px]">Verified Caregiver</h2>
            <p className="font-nunito text-[14px] text-black/70 font-normal">For Your Peace of Mind</p>
          </div>
          <div className="flex-col gap-4 flex">
            <div className="hero-perspective-card max-[520px]:scale-[0.8] max-[520px]:max-w-[200px] origin-bottom flex items-center gap-3 z-10 absolute bottom-20 right-0 bg-[#f1f1f1] opacity-95 rounded-[11px] p-3">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <CheckCheckIcon className="text-[#FF2F68]" /></div>
              <div>
                <h2 className="font-commissioner font-semibold text-[9px] text-[#FF2F68]">DBS/CRB Checked</h2>
                <p className="font-nunito text-[12px] font-normal">Verified & Trusted</p>
              </div>
            </div>
            <div className="hero-perspective-card max-[520px]:scale-[0.8] max-[520px]:max-w-[200px] origin-bottom flex items-center gap-3 z-10 absolute bottom-2 right-0 bg-[#f1f1f1] rounded-[11px] p-3">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <CheckCheckIcon className="text-[#FF2F68]" />
              </div>
              <div>
                <h2 className="font-commissioner font-semibold text-[9px] text-[#FF2F68]">Qualified Professional</h2>
                <p className="font-nunito text-[12px] font-normal">Experienced & Reliable</p>
              </div>
            </div>
          </div>
          </>)}

        </div>

      </div>
    </div>
  </section>);
}
