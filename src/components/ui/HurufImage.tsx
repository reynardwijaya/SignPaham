"use client";

import Image from "next/image";
import { useState } from "react";

interface HurufImageProps {
  huruf: string;
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

// Source photos are native 3:4 portrait (960x1280). Every container below
// matches that ratio exactly so object-cover never has to crop anything.
const sizeMap = {
  sm: "w-24 sm:w-28",
  md: "w-40 sm:w-48",
  lg: "w-56 sm:w-64",
};

export default function HurufImage({
  huruf,
  src,
  alt,
  size = "md",
  priority = false,
}: HurufImageProps) {
  const [hasError, setHasError] = useState(!src);
  const widthClass = sizeMap[size];

  if (hasError || !src) {
    return (
      <div
        className={`relative aspect-[3/4] ${widthClass} bg-espresso text-text-on-dark rounded-2xl flex items-center justify-center font-display font-bold text-5xl mx-auto`}
      >
        {huruf}
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] ${widthClass} rounded-2xl overflow-hidden shadow-md mx-auto`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 200px, 260px"
        className="object-cover"
        priority={priority}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
