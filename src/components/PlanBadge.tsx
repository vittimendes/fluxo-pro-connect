
import React from 'react';
import { Crown } from 'lucide-react';
import { usePremium } from '@/hooks/use-premium';
import { cn } from '@/lib/utils';

interface PlanBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export default function PlanBadge({ className, showLabel = true }: PlanBadgeProps) {
  const { isPremium } = usePremium();
  
  if (!isPremium) {
    return null;
  }
  
  return (
    <div className={cn(
      "flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium",
      className
    )}>
      <Crown className="h-3 w-3" />
      {showLabel && <span>Pro</span>}
    </div>
  );
}
