
// @file Dashboard.tsx
// Main dashboard page that displays a summary of user data,
// including upcoming appointments and financial information.

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { TodayAppointments } from '@/components/dashboard/TodayAppointments';
import { DashboardDataLoader } from '@/components/dashboard/DashboardDataLoader';

const Dashboard = () => {
  // @section User context
  const { user } = useSupabaseAuth();

  return (
    <DashboardDataLoader>
      {({ 
        appointments, 
        isLoading, 
        financialSummary,
        selectedPeriod,
        selectedMonth,
        selectedYear,
        setSelectedPeriod,
        setSelectedMonth,
        setSelectedYear,
        formatTime
      }) => (
        <div className="space-y-6 pb-8">
          {/* @component User welcome header */}
          <DashboardHeader user={user as any} />
          
          {/* @component Quick action buttons */}
          <QuickActions />
          
          {/* @component Financial summary card */}
          <FinancialSummary 
            financialSummary={financialSummary}
            selectedPeriod={selectedPeriod}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedPeriod={setSelectedPeriod}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
          />

          {/* @component Today's appointments list */}
          <TodayAppointments 
            appointments={appointments}
            isLoading={isLoading}
            formatTime={formatTime}
          />
        </div>
      )}
    </DashboardDataLoader>
  );
};

export default Dashboard;
