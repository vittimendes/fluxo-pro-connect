
// @file Dashboard.tsx
// Main dashboard page that displays a summary of user data,
// including upcoming appointments and financial information.

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment, mockDataService } from '@/services/mockData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { TodayAppointments } from '@/components/dashboard/TodayAppointments';

const Dashboard = () => {
  // @section User context and state
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  
  // @section Period selection state
  const currentDate = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'custom' | 'all'>('current');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  // @effect Load dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // @api Get all appointments
        const allAppointments = await mockDataService.getAppointments();
        
        // @section Filter today's and future appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingAppointments = allAppointments.filter(app => {
          const appointmentDate = new Date(`${app.date}T00:00:00`);
          return appointmentDate >= today && 
                 (app.status === 'scheduled' || app.status === 'confirmed');
        });
        
        // @section Sort appointments by date and time
        upcomingAppointments.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        
        // Show up to 10 upcoming appointments
        setAppointments(upcomingAppointments.slice(0, 10));

        // @api Get financial summary for current month
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

  // @utility Format appointment time for display (9:00 -> 09:00)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* @component User welcome header */}
      <DashboardHeader user={user} />
      
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
  );
};

export default Dashboard;
