
import { useFinancialRecords } from './use-financial-records';
import { useFinancialFiltersState } from './use-financial-filters-state';
import { useFinancialFilters } from './use-financial-filters';

export const useFinancialData = () => {
  // Get financial records
  const { records, loading, availableCategories } = useFinancialRecords();
  
  // Get filter state and handlers
  const {
    selectedClientId,
    selectedCategory,
    selectedPeriod,
    dateRange,
    handleClientChange,
    handleCategoryChange,
    handlePeriodChange,
    handleDateRangeChange,
    handleClearFilters
  } = useFinancialFiltersState();
  
  // Apply filters and get filtered records and summary
  const { filteredRecords, summary } = useFinancialFilters(
    records,
    selectedClientId,
    selectedCategory,
    selectedPeriod,
    dateRange
  );

  // Return everything needed by components
  return {
    records: filteredRecords,
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
  };
};
