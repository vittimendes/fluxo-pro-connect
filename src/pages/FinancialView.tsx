
import { useParams } from 'react-router-dom';
import { useFinancialView } from '@/hooks/use-financial-view';
import { FinancialViewHeader } from '@/components/financial/view/FinancialViewHeader';
import { FinancialRecordDetails } from '@/components/financial/view/FinancialRecordDetails';
import { DeleteFinancialRecordDialog } from '@/components/financial/view/DeleteFinancialRecordDialog';
import { FinancialViewLoading } from '@/components/financial/view/FinancialViewLoading';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FinancialView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    loading, 
    record, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDeleteRecord 
  } = useFinancialView(id);

  if (loading) {
    return <FinancialViewLoading />;
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
      <FinancialViewHeader />
      <FinancialRecordDetails 
        record={record} 
        onDeleteClick={() => setIsDeleteDialogOpen(true)} 
      />
      <DeleteFinancialRecordDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRecord} 
      />
    </div>
  );
};

export default FinancialView;
