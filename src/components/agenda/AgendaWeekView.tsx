import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '@/services/mockData';
import { CalendarX } from 'lucide-react';


interface AgendaWeekViewProps {
  weekDays: Date[];
  loading: boolean;
  getAppointmentsForDay: (date: Date) => Appointment[];
  formatTime: (time: string) => string;
  renderStatusBadge: (status: string) => JSX.Element | null;
  setCurrentDate: (date: Date) => void; // nova prop
  setView: (view: 'day' | 'week' | 'month') => void; // nova prop
}

export const AgendaWeekView = ({
  weekDays,
  loading,
  getAppointmentsForDay,
  formatTime,
  renderStatusBadge,
  setCurrentDate,
  setView
}: AgendaWeekViewProps) => {
  const navigate = useNavigate();

  // Substitua o onClick existente por esta nova função
  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
    setView('day');
  };

  // Alterado para array com índices compatíveis com getDay()
  const weekDayMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-xs sm:text-sm">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col">
            <div 
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square sm:aspect-auto sm:h-14 p-0.5 sm:p-1 
                text-center font-medium rounded-t-md
                cursor-pointer hover:bg-muted/10
                ${isSameDay(day, new Date()) ? 'bg-primary/10 text-primary' : 'bg-card'}
              `}
            >
              <div className="text-muted-foreground">{weekDayMap[day.getDay()]}</div>
              <div className="text-base sm:text-lg">{format(day, 'd')}</div>
            </div>
            <div className="flex-1 min-h-[120px] sm:min-h-[200px] bg-card rounded-b-md overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-primary"></div>
                </div>
              ) : (
                <>
                  {getAppointmentsForDay(day).length > 0 ? (
                    getAppointmentsForDay(day).map((app) => (
                      <div 
                        key={app.id}
                        className="p-1 mb-1 bg-white rounded border-l-4 border-primary text-xs cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/agenda/${app.id}`)}
                      >
                        <div className="font-semibold truncate">{formatTime(app.time)}</div>
                        <div className="truncate">{app.clientName}</div>
                        <div className="mt-1">{renderStatusBadge(app.status)}</div>
                      </div>
                    ))
                  ) : (
                      <div className="p-2 flex items-center justify-center text-muted-foreground">
                        <CalendarX className="h-5 w-5 opacity-60" />
                      </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
