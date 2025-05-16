
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';

interface AppointmentDateTimeFieldsProps {
  date: Date;
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppointmentDateTimeFields = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange 
}: AppointmentDateTimeFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "dd 'de' MMMM',' yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Hora</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="time"
            name="time"
            type="time"
            value={time}
            onChange={onTimeChange}
            className="pl-10"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentDateTimeFields;
