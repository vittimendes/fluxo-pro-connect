
// @file ClientSearchBar.tsx
// Search input component for filtering clients by name, phone or email.

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// @component ClientSearchBar props definition
interface ClientSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// @component Search input with icon
const ClientSearchBar = ({ searchQuery, onSearchChange }: ClientSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por nome ou telefone..."
        className="pl-10"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default ClientSearchBar;
