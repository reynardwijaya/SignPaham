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

const sizeMap = {
  sm: { w: 100, h: 100 },
  md: { w: 200, h: 200 },
  lg: { w: 300, h: 300 },
};

export default function HurufImage({
  huruf,
  src,
  alt,
  size = "md",
  priority = false,
}: HurufImageProps) {
  const [hasError, setHasError] = useState(!src);
  const { w, h } = sizeMap[size];

  if (hasError || !src) {
    return (
      <div
        className="bg-espresso text-text-on-dark rounded-lg flex items-center justify-center font-display font-bold"
        style={{ width: w, height: h, fontSize: w / 2 }}
      >
        {huruf}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-lg"
        priority={priority}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
