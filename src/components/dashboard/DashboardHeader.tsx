
import React from 'react';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { User } from '@/types/user';
import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const { t, i18n } = useTranslation();
  
  // Seleciona o locale apropriado baseado no idioma atual
  const getLocale = () => {
    const lang = i18n.language;
    if (lang.startsWith('pt')) return ptBR;
    if (lang.startsWith('en')) return enUS;
    return ptBR; // fallback
  };
  
  const locale = getLocale();
  const dateFormat = i18n.language.startsWith('pt') 
    ? "EEEE, dd 'de' MMMM" 
    : "EEEE, MMMM dd";
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {t('greeting')}, {user?.name?.split(' ')[0]}
      </h2>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          {format(new Date(), dateFormat, { locale })}
        </p>
      </div>
    </div>
  );
};
