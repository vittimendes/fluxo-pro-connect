// @file SidebarNavigation.tsx
// Desktop sidebar navigation component that displays a vertical
// menu with navigation links.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// @section Type definitions
interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

type SidebarNavigationProps = {
  navItems: NavItem[];
};

// @component Desktop sidebar navigation with active item highlighting
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ navItems }) => {
  return (
    <div className="w-60 bg-white border-r border-border h-screen sticky top-0">
      {/* @component App logo/title */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-primary">ProAgenda</h2>
      </div>
      
      {/* @component Navigation links */}
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarNavigation;
