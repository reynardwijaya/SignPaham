"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type PillCardColor = "espresso" | "marigold" | "maroon";

interface PillCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: PillCardColor;
  isSelected?: boolean;
  children?: React.ReactNode;
  badge?: React.ReactNode;
  isClickable?: boolean;
}

const colorMap: Record<PillCardColor, string> = {
  espresso: "bg-espresso",
  marigold: "bg-marigold",
  maroon: "bg-maroon",
};

const textColorMap: Record<PillCardColor, string> = {
  espresso: "text-text-on-dark",
  marigold: "text-espresso",
  maroon: "text-text-on-dark",
};

export const PillCard = React.forwardRef<HTMLButtonElement, PillCardProps>(
  (
    {
      color = "espresso",
      isSelected = false,
      badge,
      isClickable = true,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref as any}
        type={type}
        whileHover={isClickable ? { scale: 1.05 } : {}}
        whileTap={isClickable ? { scale: 0.98 } : {}}
        className={clsx(
          "relative rounded-pill border-2 border-surface shadow-lg transition-all",
          colorMap[color],
          textColorMap[color],
          isSelected && "ring-2 ring-offset-2 ring-espresso",
          isClickable && "cursor-pointer",
          !isClickable && "cursor-default",
          className
        )}
        disabled={!isClickable}
        {...(props as any)}
      >
        {children}
        {badge && (
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-surface rounded-full flex items-center justify-center text-xs font-bold text-espresso shadow-md">
            {badge}
          </div>
        )}
      </motion.button>
    );
  }
);

PillCard.displayName = "PillCard";

export default PillCard;
