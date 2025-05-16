
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialRecord } from "@/services/types";
import { FinancialTransactionsList } from "./FinancialTransactionsList";

interface FinancialTransactionTabsProps {
  records: FinancialRecord[];
  loading: boolean;
}

export const FinancialTransactionTabs = ({ records, loading }: FinancialTransactionTabsProps) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="income">Receitas</TabsTrigger>
        <TabsTrigger value="expense">Despesas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        <FinancialTransactionsList 
          records={records}
          loading={loading}
        />
      </TabsContent>
      
      <TabsContent value="income" className="space-y-4">
        <FinancialTransactionsList 
          records={records.filter(record => record.type === 'income')}
          loading={loading}
        />
      </TabsContent>
      
      <TabsContent value="expense" className="space-y-4">
        <FinancialTransactionsList 
          records={records.filter(record => record.type === 'expense')}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
};
