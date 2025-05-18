
import { Card } from '@/components/ui/card';
import { FinancialSummaryHeader } from './FinancialSummaryHeader';
import { FinancialMetricsDisplay } from './FinancialMetricsDisplay';

interface FinancialSummary {
  income: number;
  expenses: number;
  balance: number;
}

interface FinancialSummaryProps {
  financialSummary: FinancialSummary;
  selectedPeriod: 'current' | 'custom' | 'all';
  selectedMonth: number;
  selectedYear: number;
  setSelectedPeriod: (period: 'current' | 'custom' | 'all') => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

export const FinancialSummary = ({ 
  financialSummary
}: FinancialSummaryProps) => {
  return (
    <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
      <FinancialSummaryHeader />
      <FinancialMetricsDisplay 
        income={financialSummary.income}
        expenses={financialSummary.expenses}
        balance={financialSummary.balance}
      />
    </Card>
  );
};
