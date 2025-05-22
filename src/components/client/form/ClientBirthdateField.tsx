// filepath: c:\Users\User\Meu Drive\lovable\apps\fluxo-pro-connect\src\components\client\form\ClientBirthdateField.tsx
import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientFormValues } from '@/lib/schemas/client-schema';

interface ClientBirthdateFieldProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ClientBirthdateField = ({
  form
}: ClientBirthdateFieldProps) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  
  // Calculate minimum date (100 years ago) and maximum date (today)
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100);

  // Prepare month and year options
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return {
      value: i,
      label: format(date, 'LLLL', { locale: ptBR }) // Get full month name in Portuguese
    };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 101 }, // 100 years in the past + current year
    (_, i) => currentYear - i
  );

  // Handle month/year change to update the calendar view
  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value));
  };

  const handleYearChange = (value: string) => {
    setYear(parseInt(value));
  };

  // Update calendar view when month/year changes
  const calendarDate = new Date(year, month, 1);

  return (
    <FormField
      control={form.control}
      name="birthdate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data de Nascimento</FormLabel>
          <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal flex justify-between items-center",
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
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <div className="p-3 border-b flex justify-between space-x-2">
                  <Select 
                    value={month.toString()} 
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value.toString()}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={year.toString()} 
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent className="h-80">
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpen(false);
                    
                    // Update month and year state when a date is selected
                    if (date) {
                      setMonth(date.getMonth());
                      setYear(date.getFullYear());
                    }
                  }}
                  disabled={(date) => date > today || date < minDate}
                  month={calendarDate}
                  onMonthChange={(date) => {
                    setMonth(date.getMonth());
                    setYear(date.getFullYear());
                  }}
                  initialFocus
                  className="p-3"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormDescription>
            Selecione a data de nascimento do cliente
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
