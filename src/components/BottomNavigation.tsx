
import { useLocation, Link } from 'react-router-dom';
import { Calendar, Wallet, LayoutDashboard, User, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import * as React from 'react';

// Define a more specific type for our icons using LucideIcon
interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  // ✅ Armazene os textos antes
  const navLabels = {
    agenda: t("agenda.title"),
    financial: t("financial.title"),
    dashboard: t("dashboard.title"),
    profile: t("profile.title"),
  };

  const navItems: NavItem[] = [
    {
      name: navLabels.agenda,
      path: '/agenda',
      icon: Calendar,
    },
    {
      name: navLabels.financial,
      path: '/financeiro',
      icon: Wallet,
    },
    {
      name: navLabels.dashboard,
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: navLabels.profile,
      path: '/perfil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg animate-fade-in">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-1 flex-col items-center py-3 px-1",
                "transition-colors duration-200",
                currentPath === item.path
                  ? "text-primary font-medium"
                  : "text-gray-500 hover:text-primary"
              )}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};


export default BottomNavigation;
