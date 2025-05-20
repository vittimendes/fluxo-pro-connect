
import { useNavigate, useLocation } from 'react-router-dom';
import { FinancialRecordPageHeader } from '@/components/financial/FinancialRecordPageHeader';
import { FinancialRecordForm } from '@/components/financial/FinancialRecordForm';
import { useFinancialRecord } from '@/hooks/use-financial-record';

const NovoRegistroFinanceiro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query params to get appointmentId if coming from appointment view
  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointmentId');

  // Use our custom hook to handle data fetching and form submission
  const { clients, appointment, loading, submitFinancialRecord } = useFinancialRecord(appointmentId);

  const handleSubmit = async (formData: any) => {
    const success = await submitFinancialRecord(formData);
    if (success) {
      // Conditional redirect: if coming from appointment view, go back to it
      if (appointmentId) {
        navigate(`/agenda/${appointmentId}`);
      } else {
        // Original behavior: go to financial page
        navigate('/financeiro');
      }
    }
  };

  return (
    <div className="space-y-6">
      <FinancialRecordPageHeader title="Novo Registro Financeiro" />
      <FinancialRecordForm
        clients={clients}
        appointment={appointment}
        appointmentId={appointmentId}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default NovoRegistroFinanceiro;
