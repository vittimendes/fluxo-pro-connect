
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FinancialCategoryFieldProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const FinancialCategoryField: React.FC<FinancialCategoryFieldProps> = ({ value, onValueChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Categoria (opcional)</Label>
      <Select 
        value={value} 
        onValueChange={(value) => onValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Serviços">Serviços</SelectItem>
          <SelectItem value="Material">Material</SelectItem>
          <SelectItem value="Suprimentos">Suprimentos</SelectItem>
          <SelectItem value="Aluguel">Aluguel</SelectItem>
          <SelectItem value="Marketing">Marketing</SelectItem>
          <SelectItem value="Impostos">Impostos</SelectItem>
          <SelectItem value="Outros">Outros</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
