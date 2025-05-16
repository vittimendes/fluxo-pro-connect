
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@/types/user';
import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? ptBR : undefined;
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {t('greeting')}, {user?.name?.split(' ')[0]}
      </h2>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale })}
        </p>
      </div>
    </div>
  );
};
