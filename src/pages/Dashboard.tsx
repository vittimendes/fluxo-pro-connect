
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
        
        // If no appointments for today, get future appointments
        if (todayAppointments.length === 0) {
          const allAppointments = await mockDataService.getAppointments();
          // Filter future appointments
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          
          const futureAppointments = allAppointments.filter(app => {
            const appointmentDate = new Date(`${app.date}T${app.time}`);
            return appointmentDate >= tomorrow && app.status !== 'canceled' && app.status !== 'completed';
          });
          
          // Sort by date (ascending)
          futureAppointments.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          });
          
          // Show just the next few appointments
          setAppointments(futureAppointments.slice(0, 3));
        } else {
          setAppointments(todayAppointments);
        }

        // Get financial summary for current month
        const summary = await mockDataService.getMonthlyFinancialSummary(
          currentDate.getMonth(),
          currentDate.getFullYear()
        );
        setFinancialSummary(summary);
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
