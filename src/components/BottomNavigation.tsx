
import { useLocation, Link } from 'react-router-dom';
import { Calendar, Wallet, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    {
      name: 'Agenda',
      path: '/agenda',
      icon: Calendar
    },
    {
      name: 'Financeiro',
      path: '/financeiro',
      icon: Wallet
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Perfil',
      path: '/perfil',
      icon: User
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg animate-fade-in">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-1 flex-col items-center py-3 px-1",
              "transition-colors duration-200",
              currentPath === item.path ? 
                "text-primary font-medium" : 
                "text-gray-500 hover:text-primary"
            )}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
