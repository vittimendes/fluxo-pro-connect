
// @file BackToAgendaButton.tsx
// Navigation button to return to the agenda page.

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

// @component BackToAgendaButton component
const BackToAgendaButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button variant="outline" onClick={() => navigate('/agenda')}>
      <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
    </Button>
  );
};

export default BackToAgendaButton;
