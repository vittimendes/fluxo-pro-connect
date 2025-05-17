import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
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
  
  const viewLabels: Record<'day' | 'week' | 'month', string> = {
    day: 'Dia',
    week: 'Semana',
    month: 'Mês',
  };
  
  const cycleView = () => {
    const views: Array<'day' | 'week' | 'month'> = ['day', 'week', 'month'];
    const currentIndex = views.indexOf(currentView);
    const nextIndex = (currentIndex + 1) % views.length;
    setView(views[nextIndex]);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
          Agenda
        </h2>
        <Button onClick={() => navigate('/agenda/novo')} size="sm">
          <Plus className="h-4 w-4 mr-1" /> 
          <span className="hidden sm:inline">Novo</span>
        </Button>
      </div>

      <div className="flex flex-row gap-2 items-center mt-3">
        <div>
          <Button 
            variant={currentView ? "default" : "outline"} 
            size="sm" 
            onClick={cycleView}
            className="min-w-[80px] text-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            {viewLabels[currentView]}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevious} 
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
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

          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext} 
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
