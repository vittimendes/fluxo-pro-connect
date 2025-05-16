
import { Clock, MapPin, User } from 'lucide-react';

interface AppointmentDetailsProps {
  time: string;
  duration: number | string;
  clientName: string;
  location: string;
  type: string;
  formatTime: (time: string) => string;
  getLocationText: (location: string) => string;
}

export const AppointmentDetails = ({
  time,
  duration,
  clientName,
  location,
  type,
  formatTime,
  getLocationText
}: AppointmentDetailsProps) => {
  return (
    <div className="space-y-2 flex-1">
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="font-medium">
          {formatTime(time)} - {duration} min
        </span>
      </div>
      <div className="flex items-center">
        <User className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="font-medium">{clientName}</span>
      </div>
      <div className="flex">
        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="text-sm">{getLocationText(location)}</span>
      </div>
      <div className="inline-block bg-primary-muted text-primary text-xs px-2 py-0.5 rounded-full">
        {type}
      </div>
    </div>
  );
};
