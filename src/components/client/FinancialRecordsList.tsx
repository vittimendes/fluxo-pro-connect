
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FinancialRecord } from '@/services/types';
import { Calendar, TrendingUp, TrendingDown, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePremium } from '@/hooks/use-premium';
import { PremiumFeature } from '@/components/PremiumFeature';

interface FinancialRecordsListProps {
  financialRecords: FinancialRecord[];
  clientId: string;
}

export default function FinancialRecordsList({ financialRecords, clientId }: FinancialRecordsListProps) {
  const navigate = useNavigate();
  const { isPremium } = usePremium();

  if (financialRecords.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Nenhum registro financeiro para este cliente.</p>
        <Button 
          variant="link" 
          onClick={() => navigate(`/financeiro/novo?clientId=${clientId}`)}
        >
          Adicionar registro financeiro
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };

  return (
    <PremiumFeature>
      <div className="space-y-3">
        {financialRecords.map(record => (
          <Card 
            key={record.id} 
            className={`hover:shadow-sm cursor-pointer transition-shadow border-l-4 ${
              record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'
            }`}
            onClick={() => navigate(`/financeiro/${record.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center">
                    {record.type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="font-medium">{record.description}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {format(parseISO(record.date), "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                  {record.category && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>Categoria: {record.category}</span>
                    </div>
                  )}
                </div>
                
                <span
                  className={`font-semibold ${
                    record.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(record.amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PremiumFeature>
  );
}
