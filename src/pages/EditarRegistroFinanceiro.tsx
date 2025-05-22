import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FinancialRecord } from '@/services/types';
import { FinancialRecordPage } from '@/components/financial/record/FinancialRecordPage';
import { useFinancialRecord } from '@/hooks/use-financial-record';
import { useToast } from '@/hooks/use-toast';
import { FinancialRecordFormData } from '@/types/forms';
import { useFinancialRepository } from '@/hooks/use-financial-repository';

const EditarRegistroFinanceiro = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  
  // Use our custom hook to handle data fetching and form submission
  const { clients, loading: clientsLoading, updateFinancialRecord } = useFinancialRecord(null);
  const { getRecordById } = useFinancialRepository();

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        const financialRecord = await getRecordById(id);
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
          description: "Não foi possível carregar os detalhes do registro financeiro.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, navigate, toast, getRecordById]);

  const handleSubmit = async (formData: FinancialRecordFormData) => {
    if (!id) return false;
    
    const success = await updateFinancialRecord(id, formData);
    if (success) {
      navigate(`/financeiro/${id}`);
    }
    return success;
  };

  return (
    <div className="space-y-6">
      <FinancialRecordPage 
        title="Editar Registro Financeiro"
        clients={clients}
        appointment={null}
        appointmentId={record?.relatedAppointment || null}
        loading={clientsLoading || loading}
        initialData={record}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditarRegistroFinanceiro;
