import React from 'react';
import { Client } from '@/services/mockData';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FinancialClientFieldProps {
  clients: Client[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  emptyStateText?: string;
}

export const FinancialClientField: React.FC<FinancialClientFieldProps> = ({ 
  clients, 
  value, 
  onValueChange, 
  disabled,
  emptyStateText
}) => {
  if (!clients || clients.length === 0) {
    return (
      <div className="space-y-2 text-center text-muted-foreground border border-dashed rounded p-4 bg-muted/20">
        {emptyStateText || 'Nenhum cliente disponível.'}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="clientId">Cliente (opcional)</Label>
      <Select 
        value={value} 
        onValueChange={(value) => onValueChange(value)}
        disabled={disabled}
      >
        <SelectTrigger disabled={disabled}>
          <SelectValue placeholder="Selecione um cliente" />
        </SelectTrigger>
        <SelectContent>
          {clients.map(client => (
            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
