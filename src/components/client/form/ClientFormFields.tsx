
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ClientBirthdateField } from './ClientBirthdateField';

interface ClientFormFieldsProps {
  form: UseFormReturn<any>;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectingYear: boolean;
  setSelectingYear: (selecting: boolean) => void;
}

export const ClientFormFields = ({
  form,
  selectedYear,
  setSelectedYear,
  selectingYear,
  setSelectingYear
}: ClientFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome do cliente" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 11912345678" {...field} />
            </FormControl>
            <FormDescription>
              Inclua o DDD sem parênteses
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="email@exemplo.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <ClientBirthdateField 
        form={form}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectingYear={selectingYear}
        setSelectingYear={setSelectingYear}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações (opcional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informações adicionais sobre o cliente"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
