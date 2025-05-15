
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Home, Calendar, DollarSign, Users, User } from 'lucide-react';

const AppLayout = () => {
  // Define navigation items to pass to BottomNavigation
  const navItems = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/agenda', label: 'Agenda', icon: Calendar },
    { path: '/financeiro', label: 'Finanças', icon: DollarSign },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b p-2">
        <div className="flex justify-end max-w-lg mx-auto">
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex-1 pt-4 pb-20 px-4 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <BottomNavigation navItems={navItems} />
    </div>
  );
};

export default AppLayout;
