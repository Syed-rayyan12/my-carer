import type { ReactNode } from "react";
﻿import HeroSection from "./HeroSection";
import type { BannerPage } from "./bannerAnimationSettings";

type Props = {
  heart: ReactNode;
  withSearch?: boolean;
  animationPage: BannerPage;
  label: string;
  title: string;
  description: string;
  heartAfter?: string;
  action?: { label: string; href: string };
};

export default function PlatformPageHero(props: Props) {
  return <HeroSection variant="page" {...props} />;
}
