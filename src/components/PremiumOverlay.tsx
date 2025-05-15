
import React from 'react';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsPro } from '@/lib/use-plan';

interface PremiumOverlayProps {
  children: React.ReactNode;
  className?: string;
  tooltipContent?: string;
  showLock?: boolean;
}

export default function PremiumOverlay({
  children,
  className,
  tooltipContent = "Disponível no Plano Pro. Saiba mais nas configurações.",
  showLock = true
}: PremiumOverlayProps) {
  const isPro = useIsPro();
  
  if (isPro) {
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
