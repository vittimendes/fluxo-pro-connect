
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Clock, MapPin } from 'lucide-react';
import { Appointment } from '@/services/types';

interface AppointmentCardProps {
  appointment: Appointment;
  formatTime: (time: string) => string;
  getLocationIcon: (location: string) => React.ReactNode;
  getLocationText: (location: string) => string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  formatTime,
  getLocationIcon,
  getLocationText
}) => {
  return (
    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center mb-1">
              <User className="h-4 w-4 mr-1" />
              <span className="font-medium">{appointment.clientName}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTime(appointment.time)} - {appointment.duration} min</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {getLocationIcon(appointment.location)}
              <span className="ml-1">{getLocationText(appointment.location)}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-primary-muted text-primary text-xs px-2 py-1 rounded-full">
              {appointment.type}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
