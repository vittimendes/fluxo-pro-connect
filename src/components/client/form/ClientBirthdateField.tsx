
import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';

interface ClientBirthdateFieldProps {
  form: UseFormReturn<any>;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectingYear: boolean;
  setSelectingYear: (selecting: boolean) => void;
}

export const ClientBirthdateField = ({
  form,
  selectedYear,
  setSelectedYear,
  selectingYear,
  setSelectingYear
}: ClientBirthdateFieldProps) => {
  // Generate year options for the year selector
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100; // 100 years ago
    const years = [];
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  };
  
  // Handle year selection
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectingYear(false);
    
    // Update the calendar view to the selected year
    const currentDate = form.getValues('birthdate') || new Date();
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    form.setValue('birthdate', newDate);
  };

  return (
    <FormField
      control={form.control}
      name="birthdate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data de Nascimento <span className="text-destructive">*</span></FormLabel>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "flex-1 pl-3 text-left font-normal flex justify-between items-center",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="h-4 w-4 opacity-50 ml-auto" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="font-medium">Selecione a data</div>
                  <Popover open={selectingYear} onOpenChange={setSelectingYear}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs font-normal"
                      >
                        {selectedYear}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="h-64 overflow-y-auto p-2">
                        <div className="grid grid-cols-4 gap-1">
                          {generateYearOptions().map(year => (
                            <Button
                              key={year}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 text-xs",
                                year === selectedYear && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => handleYearSelect(year)}
                            >
                              {year}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date()}
                  defaultMonth={field.value || new Date(selectedYear, 0)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormDescription>
            A data de nascimento é obrigatória para o cadastro do cliente
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
