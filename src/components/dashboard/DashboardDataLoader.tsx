// @file DashboardDataLoader.tsx
// Component responsible for loading and providing dashboard data to child components

import { useState, useEffect } from 'react';
import { Appointment } from '@/services/mockData';
import { useAppointmentRepository } from '@/hooks/use-appointment-repository';
import { useFinancialRepository } from '@/hooks/use-financial-repository';

// @types Component props
interface DashboardDataLoaderProps {
  children: (props: {
    appointments: Appointment[];
    isLoading: boolean;
    financialSummary: {
      income: number;
      expenses: number;
      balance: number;
    };
    selectedPeriod: 'current' | 'custom' | 'all';
    selectedMonth: number;
    selectedYear: number;
    setSelectedPeriod: (period: 'current' | 'custom' | 'all') => void;
    setSelectedMonth: (month: number) => void;
    setSelectedYear: (year: number) => void;
    formatTime: (time: string) => string;
  }) => React.ReactNode;
}

// @component Dashboard data loader
export const DashboardDataLoader: React.FC<DashboardDataLoaderProps> = ({ children }) => {
  // @state Dashboard data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  
  // @state Period selection
  const currentDate = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'custom' | 'all'>('current');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  // Get appointments and financial records from repositories
  const { appointments: allAppointments, loading: appointmentsLoading } = useAppointmentRepository();
  const { records, loading: financialLoading } = useFinancialRepository();

  // @effect Load dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use already loaded appointments from repository
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingAppointments = allAppointments.filter(app => {
          const appointmentDate = new Date(`${app.date}T00:00:00`);
          return appointmentDate >= today && 
                 (app.status === 'scheduled' || app.status === 'confirmed');
        });
        upcomingAppointments.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        setAppointments(upcomingAppointments.slice(0, 10));
        // Calculate financial summary for selected month/year
        const month = selectedMonth;
        const year = selectedYear;
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const summaryRecords = records.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= startDate && recordDate <= endDate;
        });
        const income = summaryRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
        const expenses = summaryRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + Math.abs(r.amount), 0);
        setFinancialSummary({ income, expenses, balance: income - expenses });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, selectedMonth, selectedYear, allAppointments, records]);

  // @utility Format appointment time for display (9:00 -> 09:00)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // @render Provide data to children
  return (
    <>
      {children({
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
      })}
    </>
  );
};
