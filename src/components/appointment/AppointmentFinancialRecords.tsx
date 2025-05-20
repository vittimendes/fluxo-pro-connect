
import { FinancialRecord } from '@/services/types';
import { format, parseISO } from 'date-fns';
import { Banknote, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AppointmentFinancialRecordsProps {
  records: FinancialRecord[];
  appointmentId: string;
}

export default function AppointmentFinancialRecords({ records, appointmentId }: AppointmentFinancialRecordsProps) {
  const navigate = useNavigate();
  
  // Format amount to display as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleAddFinancialRecord = () => {
    navigate(`/financeiro/novo?appointmentId=${appointmentId}`);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Registros Financeiros Vinculados</h3>
      
      {records.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <Banknote className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-muted-foreground mb-4">
            Nenhum registro financeiro vinculado a este atendimento.
          </p>
          <Button 
            variant="outline" 
            onClick={handleAddFinancialRecord}
            className="mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Registro Financeiro
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(record => (
            <Card key={record.id} className={`border-l-4 ${record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-medium">{record.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(parseISO(record.date), "dd/MM/yyyy")}
                  </div>
                </div>
                <div className={`font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(record.amount))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              onClick={handleAddFinancialRecord}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Registro Financeiro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
