
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FinancialRecord, mockDataService } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag, DollarSign, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FinancialView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        const financialRecord = await mockDataService.getFinancialRecordById(id);
        if (financialRecord) {
          setRecord(financialRecord);
        } else {
          toast({
            title: "Registro não encontrado",
            description: "O registro financeiro solicitado não foi encontrado.",
            variant: "destructive"
          });
          navigate('/financeiro');
        }
      } catch (error) {
        console.error('Error fetching financial record:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível obter os detalhes do registro financeiro.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, navigate, toast]);

  const handleDeleteRecord = async () => {
    try {
      if (!id) return;
      
      const success = await mockDataService.deleteFinancialRecord(id);
      if (success) {
        toast({
          title: "Registro excluído com sucesso",
          description: "O registro financeiro foi removido com sucesso."
        });
        navigate('/financeiro');
      } else {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o registro financeiro.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting financial record:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao tentar excluir o registro.",
        variant: "destructive"
      });
    }
  };

  // Format amount to display as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Registro não encontrado.</p>
        <Button onClick={() => navigate('/financeiro')} className="mt-4">
          Voltar para Financeiro
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="gap-2 pl-1"
        onClick={() => navigate('/financeiro')}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

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
                onClick={() => navigate(`/financeiro/${id}/editar`)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro financeiro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro financeiro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecord} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FinancialView;
