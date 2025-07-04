import { format, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '@/services/mockData';
import { useState, useEffect } from 'react';

interface MonthDay {
  date: Date;
  isCurrentMonth: boolean;
}

interface AgendaMonthViewProps {
  generateMonthDays: () => Promise<MonthDay[]> | MonthDay[];
  loading: boolean;
  getAppointmentsForDay: (date: Date) => Appointment[];
  formatTime: (time: string) => string;
  setCurrentDate: (date: Date) => void;
  setView: (view: 'day' | 'week' | 'month') => void;
}

export const AgendaMonthView = ({
  generateMonthDays,
  loading,
  getAppointmentsForDay,
  formatTime,
  setCurrentDate,
  setView
}: AgendaMonthViewProps) => {
  const navigate = useNavigate();
  const [monthDays, setMonthDays] = useState<MonthDay[]>([]);
  
  useEffect(() => {
    const loadMonthDays = async () => {
      const days = await generateMonthDays();
      setMonthDays(days);
    };
    
    loadMonthDays();
  }, [generateMonthDays]);

  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-xs sm:text-sm">
        {/* Day headers */}
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
          <div key={`header-${i}`} className="text-center p-0.5 sm:p-1 font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {monthDays.map((day, index) => (
          <div 
            key={`day-${index}`} 
            className={`
              aspect-square sm:aspect-auto sm:min-h-[100px] border p-0.5 sm:p-1 
              ${day.isCurrentMonth ? 
                (isSameDay(day.date, new Date()) ? 'bg-primary/10 border-primary' : 'bg-card') : 
                'bg-muted/20 opacity-50'} 
              text-center cursor-pointer hover:bg-muted/10 overflow-hidden
            `}
            onClick={() => {
              setCurrentDate(day.date);
              setView('day');
            }}
          >
            <div className={`
              text-right text-xs sm:text-sm font-medium mb-0.5 sm:mb-1
              ${isSameDay(day.date, new Date()) ? 'text-primary' : ''}
            `}>
              {format(day.date, 'd')}
            </div>
            <div className="overflow-y-auto max-h-[calc(100%-1.5rem)] sm:max-h-[80px]">
              {loading ? (
                <div className="animate-pulse h-2 bg-muted rounded my-1"></div>
              ) : (
                getAppointmentsForDay(day.date).slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/agenda/${app.id}`);
                    }}
                    className="text-left text-[10px] truncate py-0.5 px-1 mb-0.5 rounded bg-primary/10 hover:bg-primary/20"
                  >
                    {formatTime(app.time)} {app.clientName}
                  </div>
                ))
              )}
              {getAppointmentsForDay(day.date).length > 3 && (
                <div className="text-[10px] text-muted-foreground text-center">
                  +{getAppointmentsForDay(day.date).length - 3} mais
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
