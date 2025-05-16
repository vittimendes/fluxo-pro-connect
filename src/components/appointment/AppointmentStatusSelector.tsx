
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusStyles, statusOptions } from "./AppointmentStatusUtils";

interface AppointmentStatusSelectorProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  isLoading: boolean;
}

export default function AppointmentStatusSelector({ 
  currentStatus, 
  onStatusChange,
  isLoading 
}: AppointmentStatusSelectorProps) {
  return (
    <Select
      value={currentStatus}
      onValueChange={onStatusChange}
      disabled={isLoading}
    >
      <SelectTrigger className={`w-[180px] ${getStatusStyles(currentStatus)}`}>
        <SelectValue 
          placeholder="Alterar status" 
          className="flex items-center"
        >
          <div className="flex items-center gap-2">
            {(() => {
              const option = statusOptions.find(s => s.value === currentStatus) || statusOptions[0];
              const StatusIcon = option.icon;
              return (
                <>
                  <StatusIcon className="h-4 w-4" />
                  <span>{option.label}</span>
                </>
              );
            })()}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center">
              <option.icon className="h-4 w-4 mr-2" />
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
