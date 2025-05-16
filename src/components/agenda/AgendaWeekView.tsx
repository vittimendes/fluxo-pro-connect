
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
}

export const AgendaWeekView = ({
  weekDays,
  loading,
  getAppointmentsForDay,
  formatTime,
  renderStatusBadge
}: AgendaWeekViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {weekDays.map((day, index) => (
        <div key={index} className="flex flex-col">
          <div 
            className={`
              p-1 text-center font-medium mb-1 rounded-t-md
              ${isSameDay(day, new Date()) ? 'bg-primary text-white' : 'bg-gray-100'}
            `}
          >
            <div>{format(day, 'EEE', { locale: ptBR })}</div>
            <div className="text-lg">{format(day, 'd')}</div>
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
  );
};
