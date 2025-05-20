
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FinancialTypeFieldProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const FinancialTypeField: React.FC<FinancialTypeFieldProps> = ({ value, onValueChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Tipo de Registro</Label>
      <Select 
        value={value} 
        onValueChange={(value) => onValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="income">Receita</SelectItem>
          <SelectItem value="expense">Despesa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
