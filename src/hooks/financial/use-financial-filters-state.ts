
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const useFinancialFiltersState = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'custom' | 'all'>('current');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleClientChange = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  const handlePeriodChange = (period: 'current' | 'custom' | 'all') => {
    setSelectedPeriod(period);
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleClearFilters = () => {
    setSelectedClientId(null);
    setSelectedCategory(null);
    setSelectedPeriod('current');
    setDateRange(undefined);
  };

  return {
    selectedClientId,
    selectedCategory,
    selectedPeriod,
    dateRange,
    handleClientChange,
    handleCategoryChange,
    handlePeriodChange,
    handleDateRangeChange,
    handleClearFilters
  };
};
