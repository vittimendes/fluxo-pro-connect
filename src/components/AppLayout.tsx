
// @file AppLayout.tsx
// Main layout component that provides the structure for the application,
// including navigation and responsive design.

import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import SidebarNavigation from './SidebarNavigation';
import { Home, Calendar, DollarSign, Users, User, Wrench } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// @component Main application layout with responsive navigation
const AppLayout = () => {
  // @section Detect mobile devices for responsive layout
  const isMobile = useIsMobile();
  
  // @section Navigation items shared between mobile and desktop
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
      {/* @component Desktop sidebar navigation */}
      {!isMobile && <SidebarNavigation navItems={navItems} />}
      
      <div className="flex flex-col flex-1">
        {/* @component Header bar */}
        <header className="bg-white border-b p-2">
          <div className="flex justify-end max-w-lg mx-auto">
            {/* LanguageSwitcher removed */}
          </div>
        </header>
        
        {/* @component Main content area with responsive padding */}
        <main className={`flex-1 pt-4 ${isMobile ? 'pb-20' : 'pb-4'} px-4 ${isMobile ? 'max-w-lg' : ''} mx-auto w-full`}>
          <Outlet />
        </main>
      </div>
      
      {/* @component Mobile bottom navigation */}
      {isMobile && <BottomNavigation navItems={navItems} />}
    </div>
  );
};

export default AppLayout;
