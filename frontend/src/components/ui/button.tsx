import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "cyber";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    const variantStyles = {
      primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow hover:shadow-indigo-500/50 focus:ring-indigo-500",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500",
      outline: "border border-slate-700 hover:bg-slate-800/80 text-slate-200 focus:ring-slate-600",
      danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 focus:ring-rose-500",
      ghost: "hover:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-700",
      cyber: "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-semibold hover:opacity-95 shadow-glow",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
