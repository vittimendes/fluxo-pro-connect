
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/services/types";
import { getAppointmentStatusColor, getAppointmentStatusIcon, getAppointmentStatusText } from "./AppointmentStatusUtils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, Clock, MapPin, User, FileText, CheckCircle } from "lucide-react";
import AppointmentStatusSelector from "./AppointmentStatusSelector";

interface AppointmentDetailsProps {
  appointment: Appointment;
  onExecuteClick: () => void;
  onStatusChange: (status: string) => void;
  statusLoading: boolean;
}

export default function AppointmentDetails({
  appointment,
  onExecuteClick,
  onStatusChange,
  statusLoading
}: AppointmentDetailsProps) {
  
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const getLocationText = (location: string) => {
    switch (location) {
      case "online":
        return "Consulta Online";
      case "in_person":
        return "Presencial";
      case "home_visit":
        return "Visita Domiciliar";
      default:
        return location;
    }
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case "online":
        return "text-blue-500";
      case "in_person":
        return "text-green-500";
      case "home_visit":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const isStatusCompleted = appointment.status === "completed";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-xl font-semibold">{appointment.type}</h2>
            <p className="text-muted-foreground">{appointment.clientName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <AppointmentStatusSelector
              currentStatus={appointment.status}
              onStatusChange={onStatusChange}
              isLoading={statusLoading}
            />
            
            {!isStatusCompleted && (
              <Button onClick={onExecuteClick} size="sm" className="ml-2">
                <CheckCircle className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline-block">Concluir</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatTime(appointment.time)} ({appointment.duration} minutos)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.clientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className={`h-4 w-4 ${getLocationColor(appointment.location)}`} />
            <span>{getLocationText(appointment.location)}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Anotações</span>
            </div>
            <p className="text-sm">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
