
import React from 'react';
import { Lock } from 'lucide-react';
import { usePremium } from '@/hooks/use-premium';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface PremiumFeatureProps {
  children: React.ReactNode;
  className?: string;
  tooltipContent?: string;
  showLock?: boolean;
}

export function PremiumFeature({
  children,
  className,
  tooltipContent = "Disponível no Plano Pro. Saiba mais nas configurações.",
  showLock = true
}: PremiumFeatureProps) {
  const { isPremium } = usePremium();
  
  if (isPremium) {
    return <>{children}</>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "relative opacity-50 cursor-not-allowed pointer-events-none",
              className
            )}
          >
            {children}
            {showLock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PremiumButton({
  children,
  className,
  ...props
}: ButtonProps) { // Using ButtonProps from shadcn/ui Button component
  const { isPremium } = usePremium();
  
  if (isPremium) {
    return <Button className={className} {...props}>{children}</Button>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            className={cn("opacity-70 cursor-not-allowed flex items-center gap-1", className)} 
            disabled 
            {...props}
          >
            <Lock className="h-3 w-3" />
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Disponível no Plano Pro. Saiba mais nas configurações.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
