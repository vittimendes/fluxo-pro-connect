import { useNavigate, useLocation } from 'react-router-dom';
import { FinancialRecordPage } from '@/components/financial/record/FinancialRecordPage';
import { useFinancialRecord } from '@/hooks/use-financial-record';
import { FinancialRecordFormData } from '@/types/forms';

const NovoRegistroFinanceiro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query params to get appointmentId if coming from appointment view
  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointmentId');

  // Use our custom hook to handle data fetching and form submission
  const { clients, appointment, loading, submitFinancialRecord } = useFinancialRecord(appointmentId);

  const handleSubmit = async (formData: FinancialRecordFormData) => {
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
    return success;
  };

  return (
    <FinancialRecordPage
      title="Novo Registro Financeiro"
      clients={clients}
      appointment={appointment}
      appointmentId={appointmentId}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default NovoRegistroFinanceiro;
