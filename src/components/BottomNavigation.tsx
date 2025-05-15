import { useLocation, Link } from 'react-router-dom';
import { Calendar, Wallet, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import * as React from 'react';

// Type for icon component
interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  // ✅ useMemo para evitar reavaliação excessiva e quebra de tipos
  const navItems: NavItem[] = React.useMemo(() => [
    {
      name: t("agenda.title"),
      path: "/agenda",
      icon: Calendar,
    },
    {
      name: t("financial.title"),
      path: "/financeiro",
      icon: Wallet,
    },
    {
      name: t("dashboard.title"),
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("profile.title"),
      path: "/perfil",
      icon: User,
    },
  ], [t]);

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
