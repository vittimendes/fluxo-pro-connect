import { useLocation, Link } from 'react-router-dom';
import { Calendar, Wallet, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import * as React from 'react';

// Use a simpler approach to type the icons
interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType; // This is a simpler type that works with any component type
}

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  // Extract translated strings first to simplify type inference within useMemo
  const agendaTitle = t("agenda.title");
  const financialTitle = t("financial.title");
  const dashboardTitle = t("dashboard.title");
  const profileTitle = t("profile.title");

  // Using useMemo to avoid excessive re-evaluation
  const navItems: NavItem[] = React.useMemo(() => [
    {
      name: agendaTitle,
      path: "/agenda",
      icon: Calendar,
    },
    {
      name: financialTitle,
      path: "/financeiro",
      icon: Wallet,
    },
    {
      name: dashboardTitle,
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: profileTitle,
      path: "/perfil",
      icon: User,
    },
  ], [agendaTitle, financialTitle, dashboardTitle, profileTitle]); // Dependencies are now the translated strings

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

