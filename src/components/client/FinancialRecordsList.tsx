
import { FinancialRecord } from '@/services/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, TrendingDown, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FinancialRecordsListProps {
  financialRecords: FinancialRecord[];
  clientId: string;
}

const FinancialRecordsList = ({ financialRecords, clientId }: FinancialRecordsListProps) => {
  const navigate = useNavigate();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };
  
  if (financialRecords.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Este cliente não possui registros financeiros.</p>
          <Button 
            variant="link" 
            onClick={() => navigate('/financeiro/novo', { state: { clientId } })}
            className="text-primary mt-2"
          >
            Criar novo registro financeiro
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {financialRecords.map((record) => (
        <Card
          key={record.id}
          className={`hover:shadow-md transition-shadow border-l-4 ${
            record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'
          } cursor-pointer`}
          onClick={() => navigate(`/financeiro/${record.id}`)}
        >
          <CardContent className="p-4 flex justify-between items-center">
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
                <CalendarClock className="h-3 w-3 mr-1" />
                <span>
                  {format(parseISO(record.date), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
            <span
              className={`font-semibold ${
                record.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(record.amount)}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialRecordsList;
