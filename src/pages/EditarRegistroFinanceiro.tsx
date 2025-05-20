import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FinancialRecord, mockDataService } from '@/services/mockData';
import { FinancialRecordPageHeader } from '@/components/financial/FinancialRecordPageHeader';
import { FinancialRecordForm } from '@/components/financial/form/FinancialForm';
import { useFinancialRecord } from '@/hooks/use-financial-record';
import { useToast } from '@/hooks/use-toast';

const EditarRegistroFinanceiro = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  
  // Use our custom hook to handle data fetching and form submission
  const { clients, loading: clientsLoading, updateFinancialRecord } = useFinancialRecord(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
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
          description: "Não foi possível carregar os detalhes do registro financeiro.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, navigate, toast]);

  const handleSubmit = async (formData: any) => {
    if (!id) return;
    
    const success = await updateFinancialRecord(id, formData);
    if (success) {
      navigate(`/financeiro/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <FinancialRecordPageHeader title="Editar Registro Financeiro" />
      {!loading && record && (
        <FinancialRecordForm
          clients={clients}
          appointment={null}
          appointmentId={record.relatedAppointment || null}
          loading={clientsLoading}
          initialData={record}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EditarRegistroFinanceiro;
