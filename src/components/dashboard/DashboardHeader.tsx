
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const dateFormat = "EEEE, dd 'de' MMMM";
  const locale = ptBR; // Default to Portuguese
  
  // Get user's name from metadata or use email as fallback
  const userName = user?.user_metadata?.name || 
                   user?.email?.split('@')[0] || 
                   'Usuário';
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        Olá, {userName}
      </h2>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          {format(new Date(), dateFormat, { locale })}
        </p>
      </div>
    </div>
  );
};
