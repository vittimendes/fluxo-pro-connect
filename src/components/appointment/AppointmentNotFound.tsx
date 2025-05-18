
// @file AppointmentNotFound.tsx
// Component displayed when an appointment is not found.

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// @component AppointmentNotFound component
const AppointmentNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <p className="text-muted-foreground">Atendimento não encontrado</p>
      <Button onClick={() => navigate('/agenda')}>
        <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para Agenda
      </Button>
    </div>
  );
};

export default AppointmentNotFound;
