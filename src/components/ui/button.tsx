import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'wow-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/30',
        destructive: 'bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-500/20 shadow-red-500/20',
        outline: 'border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white/10 text-white',
        secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border border-gray-500/20',
        ghost: 'hover:bg-white/10 text-white',
        link: 'text-primary underline-offset-4 hover:underline',
        wow: 'bg-wow-gradient text-white border border-wow-gold/30 shadow-glow hover:shadow-glow-lg',
        alliance: 'bg-alliance-gradient text-white border border-wow-alliance/30',
        horde: 'bg-horde-gradient text-white border border-wow-horde/30',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8',
        xl: 'h-14 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
