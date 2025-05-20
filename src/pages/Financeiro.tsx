
// @file Financeiro.tsx
// Financial management page that displays income, expenses,
// balances and transaction history.

import { FinancialSummaryCard } from '@/components/financial/FinancialSummaryCard';
import { FinancialPremiumFeatures } from '@/components/financial/FinancialPremiumFeatures';
import { FinancialTransactionTabs } from '@/components/financial/FinancialTransactionTabs';
import { FinancialFilters } from '@/components/financial/FinancialFilters';
import { FinancialHeader } from '@/components/financial/FinancialHeader';
import { useFinancialData } from '@/hooks/financial/use-financial-data';

const Financeiro = () => {
  // Use custom hook to manage financial data and filtering
  const { 
    records, 
    loading, 
    summary, 
    selectedClientId,
    selectedPeriod,
    dateRange,
    selectedCategory,
    availableCategories,
    handleClientChange,
    handlePeriodChange,
    handleDateRangeChange,
    handleCategoryChange,
    handleClearFilters
  } = useFinancialData();

  return (
    <div className="space-y-6">
      {/* Page header with title and new record button */}
      <FinancialHeader />

      {/* Financial summary display */}
      <FinancialSummaryCard summary={summary} />
      
      {/* Filters */}
      <FinancialFilters
        selectedClientId={selectedClientId}
        selectedPeriod={selectedPeriod}
        dateRange={dateRange}
        onClientChange={handleClientChange}
        onPeriodChange={handlePeriodChange}
        onDateRangeChange={handleDateRangeChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        availableCategories={availableCategories}
        onClearFilters={handleClearFilters}
      />
      
      {/* Premium features promotion */}
      <FinancialPremiumFeatures />

      {/* Transactions list with tabs */}
      <FinancialTransactionTabs 
        records={records}
        loading={loading}
      />
    </div>
  );
};

export default Financeiro;
