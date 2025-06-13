import * as React from 'react';
import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'wow-badge inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-white/20 bg-black/40 text-white backdrop-blur-md',
        secondary: 'border-gray-500/20 bg-gray-800/40 text-gray-200 backdrop-blur-md',
        destructive: 'border-red-500/20 bg-red-900/40 text-red-200 backdrop-blur-md',
        outline: 'border-white/30 text-white',
        // WoW-specific rating variants
        gladiator: 'rating-badge rating-gladiator',
        elite: 'rating-badge rating-elite',
        duelist: 'rating-badge rating-duelist',
        rival: 'rating-badge rating-rival',
        challenger: 'rating-badge rating-challenger',
        combatant: 'rating-badge rating-combatant',
        unranked: 'rating-badge rating-unranked',
        // WoW item quality variants
        legendary: 'border-wow-legendary/40 bg-wow-legendary/20 text-wow-legendary',
        epic: 'border-wow-epic/40 bg-wow-epic/20 text-wow-epic',
        rare: 'border-wow-rare/40 bg-wow-rare/20 text-wow-rare',
        uncommon: 'border-wow-uncommon/40 bg-wow-uncommon/20 text-wow-uncommon',
        common: 'border-white/40 bg-white/20 text-white',
        // Faction variants
        alliance: 'border-wow-alliance/40 bg-wow-alliance/20 text-wow-alliance',
        horde: 'border-wow-horde/40 bg-wow-horde/20 text-wow-horde',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
