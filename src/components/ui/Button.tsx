import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-body font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-espresso text-surface hover:bg-espresso/90 active:bg-espresso/80 focus-visible:ring-espresso shadow-lg hover:shadow-xl",
        secondary:
          "bg-marigold text-espresso hover:bg-marigold/90 active:bg-marigold/80 focus-visible:ring-marigold shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-espresso text-espresso hover:bg-espresso/10 active:bg-espresso/20 focus-visible:ring-espresso",
        ghost:
          "text-espresso hover:bg-espresso/10 focus-visible:ring-espresso",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
        xl: "w-full px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={clsx(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
