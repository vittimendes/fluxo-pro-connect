
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment, mockDataService } from '@/services/mockData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { TodayAppointments } from '@/components/dashboard/TodayAppointments';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  
  const currentDate = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'custom' | 'all'>('current');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get today's appointments
        const todayAppointments = await mockDataService.getTodayAppointments();
        setAppointments(todayAppointments);

        // Get financial summary based on selected period
        if (selectedPeriod === 'current') {
          const summary = await mockDataService.getMonthlyFinancialSummary(
            currentDate.getMonth(),
            currentDate.getFullYear()
          );
          setFinancialSummary(summary);
        } else if (selectedPeriod === 'custom') {
          const summary = await mockDataService.getMonthlyFinancialSummary(
            selectedMonth,
            selectedYear
          );
          setFinancialSummary(summary);
        } else if (selectedPeriod === 'all') {
          // This would fetch all-time summary in a real implementation
          // For mock, we'll just double the current month's data
          const summary = await mockDataService.getMonthlyFinancialSummary(
            currentDate.getMonth(),
            currentDate.getFullYear()
          );
          setFinancialSummary({
            income: summary.income * 3,
            expenses: summary.expenses * 3,
            balance: summary.balance * 3
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, selectedMonth, selectedYear]);

  // Format appointment time for display (9:00 -> 09:00)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-8">
      <DashboardHeader user={user} />
      <QuickActions />
      
      <FinancialSummary 
        financialSummary={financialSummary}
        selectedPeriod={selectedPeriod}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedPeriod={setSelectedPeriod}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
      />

      <TodayAppointments 
        appointments={appointments}
        isLoading={isLoading}
        formatTime={formatTime}
      />
    </div>
  );
};

export default Dashboard;
