
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import LanguageSwitcher from './LanguageSwitcher';

const AppLayout = () => {
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
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
