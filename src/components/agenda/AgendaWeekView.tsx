import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '@/services/mockData';

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
  setCurrentDate, // adicione aqui
  setView // adicione aqui
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
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-[320px] sm:min-w-[700px] px-4 sm:px-0">
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-xs sm:text-sm">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col">
              <div 
                onClick={() => handleDayClick(day)}
                className={`
                  p-0.5 sm:p-1 text-center font-medium mb-0.5 sm:mb-1 rounded-t-md
                  cursor-pointer hover:bg-muted/10
                  ${isSameDay(day, new Date()) ? 'bg-primary/10 text-primary' : 'bg-card'}
                `}
              >
                {/* Alterado para usar getDay() ao invés de format(day, 'i') */}
                <div className="text-muted-foreground">{weekDayMap[day.getDay()]}</div>
                <div className="text-base sm:text-lg">{format(day, 'd')}</div>
              </div>
              <div className="overflow-hidden h-64 overflow-y-auto bg-gray-50 rounded-b-md">
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
                      <div className="p-1 text-center text-muted-foreground">
                        Vazio
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
