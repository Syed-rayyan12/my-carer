"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./DashboardSkeleton";

export default function DashboardAvatar({ src, name, initials, className = "size-[62px]", variant = "soft" }: { src: string; name: string; initials: string; className?: string; variant?: "soft" | "pink" | "blush" }) {
  const [loadedSource, setLoadedSource] = useState("");
  const [failedSource, setFailedSource] = useState("");
  const showImage = Boolean(src) && failedSource !== src;
  const loaded = loadedSource === src;

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-nunito text-base font-bold ${variant === "pink" ? "bg-[#ff2f68] text-white" : variant === "blush" ? "bg-[#fff0f7] text-[#ff2f68]" : "bg-[#e5f1eb] text-[#ff2f68]"} ${className}`}>
      {showImage ? <>
        {!loaded && <span className="absolute inset-0"><Skeleton className="size-full rounded-full" /></span>}
        <Image fill sizes="62px" src={src} alt={name} className={`object-cover transition-opacity duration-200 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setLoadedSource(src)} onError={() => setFailedSource(src)} />
      </> : <span aria-label={name}>{initials}</span>}
    </span>
  );
}
