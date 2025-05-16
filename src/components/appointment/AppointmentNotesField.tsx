
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AppointmentNotesFieldProps {
  notes: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AppointmentNotesField = ({ notes, onChange }: AppointmentNotesFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Observações (opcional)</Label>
      <Textarea
        id="notes"
        name="notes"
        value={notes}
        onChange={onChange}
        placeholder="Informações adicionais sobre o agendamento"
        className="resize-none h-24"
      />
    </div>
  );
};

export default AppointmentNotesField;
