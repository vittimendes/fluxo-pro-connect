
import { useState, useEffect } from 'react';
import { FinancialRecord } from '@/services/types';
import { financialService } from '@/services/financialService';
import { useToast } from '@/hooks/use-toast';

export const useFinancialRecords = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get financial records
        const financialRecords = await financialService.getFinancialRecords();
        
        // Sort records by date (newest first)
        const sortedRecords = [...financialRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setRecords(sortedRecords);
        
        // Extract unique categories
        const categories = new Set<string>();
        sortedRecords.forEach(record => {
          if (record.category) {
            categories.add(record.category);
          }
        });
        setAvailableCategories(Array.from(categories));
        
        toast({
          title: "Dados carregados",
          description: "Registros financeiros atualizados.",
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast({
          title: "Erro ao carregar dados financeiros",
          description: "Não foi possível carregar seus registros financeiros.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return {
    records,
    loading,
    availableCategories
  };
};
