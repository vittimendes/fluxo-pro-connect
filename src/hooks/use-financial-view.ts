
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FinancialRecord, mockDataService } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

export function useFinancialView(id: string | undefined) {
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

  return {
    loading,
    record,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteRecord
  };
}
