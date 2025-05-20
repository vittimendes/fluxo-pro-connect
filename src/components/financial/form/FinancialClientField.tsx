
import React from 'react';
import { Client } from '@/services/mockData';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FinancialClientFieldProps {
  clients: Client[];
  value: string;
  onValueChange: (value: string) => void;
}

export const FinancialClientField: React.FC<FinancialClientFieldProps> = ({ 
  clients, 
  value, 
  onValueChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="clientId">Cliente (opcional)</Label>
      <Select 
        value={value} 
        onValueChange={(value) => onValueChange(value)}
      >
        <SelectTrigger>
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
