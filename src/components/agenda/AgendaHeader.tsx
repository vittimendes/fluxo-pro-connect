
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface AgendaHeaderProps {
  currentDate: Date;
  weekStartDate: Date;
  monthStartDate: Date;
  currentView: 'day' | 'week' | 'month';
  setView: (view: 'day' | 'week' | 'month') => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

export const AgendaHeader = ({
  currentDate,
  weekStartDate,
  monthStartDate,
  currentView,
  setView,
  handlePrevious,
  handleNext
}: AgendaHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Agenda</h2>
        <Button onClick={() => navigate('/agenda/novo')} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant={currentView === 'day' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setView('day')}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Dia
          </Button>
          <Button 
            variant={currentView === 'week' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setView('week')}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Semana
          </Button>
          <Button 
            variant={currentView === 'month' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setView('month')}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Mês
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentView === 'day' ? (
              format(currentDate, "dd 'de' MMMM", { locale: ptBR })
            ) : currentView === 'week' ? (
              `${format(weekStartDate, "dd/MM", { locale: ptBR })} - ${format(
                addDays(weekStartDate, 6),
                "dd/MM",
                { locale: ptBR }
              )}`
            ) : (
              format(monthStartDate, "MMMM 'de' yyyy", { locale: ptBR })
            )}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
