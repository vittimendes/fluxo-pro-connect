
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FinancialRecord } from '@/services/types';

interface FinancialRecordDetailsProps {
  record: FinancialRecord;
  onDeleteClick: () => void;
}

export const FinancialRecordDetails = ({ record, onDeleteClick }: FinancialRecordDetailsProps) => {
  const navigate = useNavigate();
  
  // Format amount to display as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };
  
  return (
    <Card className={`border-l-4 ${record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {record.type === 'income' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <CardTitle>{record.description}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/financeiro/${record.id}/editar`)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Valor:</span>
          <span className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(record.amount)}
          </span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Tipo:</span>
          <span className="font-medium">
            {record.type === 'income' ? 'Receita' : 'Despesa'}
          </span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Data:</span>
          <span>
            {format(parseISO(record.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>

        {record.category && (
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Categoria:</span>
            <span>{record.category}</span>
          </div>
        )}

        {record.clientId && record.clientName && (
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Cliente:</span>
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => navigate(`/clientes/${record.clientId}`)}
            >
              {record.clientName}
            </Button>
          </div>
        )}

        {record.appointmentId && (
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Agendamento vinculado:</span>
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => navigate(`/agenda/${record.appointmentId}`)}
            >
              Ver agendamento
            </Button>
          </div>
        )}

        {record.notes && (
          <div className="pt-2">
            <span className="text-muted-foreground block mb-1">Observações:</span>
            <p className="text-sm">{record.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/financeiro')}>
          Fechar
        </Button>
      </CardFooter>
    </Card>
  );
};
