
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import SidebarNavigation from './SidebarNavigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Home, Calendar, DollarSign, Users, User, Wrench } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout = () => {
  const isMobile = useIsMobile();
  
  // Define navigation items to pass to both navigation components
  const navItems = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/agenda', label: 'Agenda', icon: Calendar },
    { path: '/financeiro', label: 'Finanças', icon: DollarSign },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/tipos-de-atendimento', label: 'Tipos de Atendimento', icon: Wrench },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isMobile && <SidebarNavigation navItems={navItems} />}
      <div className="flex flex-col flex-1">
        <header className="bg-white border-b p-2">
          <div className="flex justify-end max-w-lg mx-auto">
            <LanguageSwitcher />
          </div>
        </header>
        <main className={`flex-1 pt-4 ${isMobile ? 'pb-20' : 'pb-4'} px-4 ${isMobile ? 'max-w-lg' : ''} mx-auto w-full`}>
          <Outlet />
        </main>
      </div>
      {isMobile && <BottomNavigation navItems={navItems} />}
    </div>
  );
};

export default AppLayout;
