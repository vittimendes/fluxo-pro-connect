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
  const { isMobile } = useIsMobile();
  
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
      {/* Sidebar for desktop */}
      {!isMobile && (
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-border h-screen sticky top-0 z-20">
          <SidebarNavigation navItems={navItems} />
        </aside>
      )}
      {/* Main content area */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header bar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4 md:py-6 flex items-center justify-between">
          {/* You can add logo/user info here if desired */}
        </header>
        <main className="main-content flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 w-full max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
      {/* Mobile bottom navigation */}
      {isMobile && <BottomNavigation navItems={navItems} />}
    </div>
  );
};

export default AppLayout;
