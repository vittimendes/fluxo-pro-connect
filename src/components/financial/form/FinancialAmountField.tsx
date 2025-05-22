import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FinancialAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const FinancialAmountField: React.FC<FinancialAmountFieldProps> = ({ value, onChange, disabled }) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters and convert to number format
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Valor (R$)</Label>
      <Input
        id="amount"
        name="amount"
        type="text"
        value={value}
        onChange={handleAmountChange}
        placeholder="0.00"
        required
        disabled={disabled}
      />
    </div>
  );
};
