
import { Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  availableCategories: string[];
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  availableCategories,
}: CategoryFilterProps) => {
  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === 'all' ? null : value);
  };

  return (
    <Select 
      value={selectedCategory || 'all'} 
      onValueChange={handleCategoryChange}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <SelectValue placeholder="Categoria" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as categorias</SelectItem>
        {availableCategories.map(category => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
