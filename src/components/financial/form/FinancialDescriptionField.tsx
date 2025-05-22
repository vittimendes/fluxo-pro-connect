import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FinancialDescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const FinancialDescriptionField: React.FC<FinancialDescriptionFieldProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Descrição</Label>
      <Input
        id="description"
        name="description"
        value={value}
        onChange={onChange}
        placeholder="Ex: Consulta - João Silva"
        required
        disabled={disabled}
      />
    </div>
  );
};
