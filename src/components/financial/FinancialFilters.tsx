
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { ClientFilter } from './filters/ClientFilter';
import { PeriodFilter } from './filters/PeriodFilter';
import { CategoryFilter } from './filters/CategoryFilter';

interface FinancialFiltersProps {
  selectedClientId: string | null;
  selectedPeriod: 'current' | 'custom' | 'all';
  dateRange: DateRange | undefined;
  onClientChange: (clientId: string | null) => void;
  onPeriodChange: (period: 'current' | 'custom' | 'all') => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  availableCategories: string[];
}

export const FinancialFilters = ({
  selectedClientId,
  selectedPeriod,
  dateRange,
  onClientChange,
  onPeriodChange,
  onDateRangeChange,
  selectedCategory,
  onCategoryChange,
  availableCategories
}: FinancialFiltersProps) => {
  const hasActiveFilters = selectedClientId || selectedCategory || selectedPeriod !== 'current';

  const handleClearFilters = () => {
    onClientChange(null);
    onCategoryChange(null);
    onPeriodChange('current');
    onDateRangeChange(undefined);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-1/2">
          <ClientFilter
            selectedClientId={selectedClientId}
            onClientChange={onClientChange}
          />
        </div>
        
        <div className="w-full sm:w-1/2">
          <PeriodFilter
            selectedPeriod={selectedPeriod}
            dateRange={dateRange}
            onPeriodChange={onPeriodChange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="w-full">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          availableCategories={availableCategories}
        />
      </div>

      {/* Clear filters button - shown when any filter is active */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearFilters}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};
