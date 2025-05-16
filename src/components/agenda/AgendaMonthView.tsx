
import { format, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '@/services/mockData';

interface MonthDay {
  date: Date;
  isCurrentMonth: boolean;
}

interface AgendaMonthViewProps {
  generateMonthDays: () => MonthDay[];
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

  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {/* Day headers */}
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
        <div key={`header-${i}`} className="text-center p-1 font-medium text-muted-foreground">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {generateMonthDays().map((day, index) => (
        <div 
          key={`day-${index}`} 
          className={`
            min-h-[80px] border p-1 ${day.isCurrentMonth ? 
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
            text-right font-medium mb-1 
            ${isSameDay(day.date, new Date()) ? 'text-primary' : ''}
          `}>
            {format(day.date, 'd')}
          </div>
          <div className="overflow-y-auto max-h-[60px]">
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
  );
};
