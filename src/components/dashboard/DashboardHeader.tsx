
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@/types/user';

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const dateFormat = "EEEE, dd 'de' MMMM";
  const locale = ptBR; // Default to Portuguese
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        Olá, {user?.name?.split(' ')[0]}
      </h2>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          {format(new Date(), dateFormat, { locale })}
        </p>
      </div>
    </div>
  );
};
