
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentDurationLocationFieldsProps {
  duration: string;
  location: string;
  onDurationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (value: string) => void;
}

const AppointmentDurationLocationFields = ({ 
  duration, 
  location, 
  onDurationChange, 
  onLocationChange 
}: AppointmentDurationLocationFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="duration">Duração (minutos)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          min="15"
          step="5"
          value={duration}
          onChange={onDurationChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Select 
          value={location} 
          onValueChange={onLocationChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_person">Presencial</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="home_visit">Domicílio</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AppointmentDurationLocationFields;
