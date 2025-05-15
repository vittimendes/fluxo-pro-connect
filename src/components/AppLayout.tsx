
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pt-4 pb-20 px-4 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
