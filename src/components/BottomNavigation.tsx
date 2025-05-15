
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

type BottomNavigationProps = {
  navItems: NavItem[];
};

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navItems }) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center flex-1 h-full",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
