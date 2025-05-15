
import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (isPro) {
    return <>{children}</>;
  }
  
  // Mobile version without tooltip
  if (isMobile) {
    return (
      <div className="space-y-2">
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
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {tooltipContent}
        </p>
      </div>
    );
  }
  
  // Desktop version with tooltip
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
