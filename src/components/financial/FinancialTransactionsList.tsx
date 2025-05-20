
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FinancialRecord } from '@/services/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, TrendingUp, TrendingDown, Calendar, Tag } from 'lucide-react';

interface FinancialTransactionsListProps {
  records: FinancialRecord[];
  loading: boolean;
}

export const FinancialTransactionsList = ({ records, loading }: FinancialTransactionsListProps) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-3">
          Nenhum registro encontrado.
        </p>
        <Button onClick={() => navigate('/financeiro/novo')}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Registro
        </Button>
      </div>
    );
  }
  
  // Format amount to display as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };
  
  return records.map(record => (
    <Card
      key={record.id}
      className={`hover:shadow-md transition-shadow border-l-4 ${
        record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'
      } cursor-pointer`}
      onClick={() => navigate(`/financeiro/${record.id}`)}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center">
            {record.type === 'income' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className="font-medium">{record.description}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {format(parseISO(record.date), "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          {record.category && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Tag className="h-3 w-3 mr-1" />
              <span>Categoria: {record.category}</span>
            </div>
          )}
        </div>
        <span
          className={`font-semibold ${
            record.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {formatCurrency(record.amount)}
        </span>
      </CardContent>
    </Card>
  ));
};
