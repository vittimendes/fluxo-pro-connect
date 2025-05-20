
import { BaseRepository } from '@/lib/repository';
import { AppointmentRepository as IAppointmentRepository } from '@/types/repository';
import { Appointment } from '@/services/types';
import { appointmentsByUser } from '@/services/store';
import { generateUniqueId, getCurrentUserId } from '@/services/utils';

export class AppointmentRepository extends BaseRepository<Appointment> implements IAppointmentRepository<Appointment> {
  protected getStore() {
    return appointmentsByUser;
  }
  
  protected generateId(): string {
    return generateUniqueId('appointment');
  }

  async getByDate(date: Date, userId?: string): Promise<Appointment[]> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const formattedDate = date.toISOString().split('T')[0];
    const allAppointments = await this.getAllByUserId(userId);
    
    return allAppointments.filter(appointment => 
      appointment.date === formattedDate
    );
  }

  async getByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<Appointment[]> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const allAppointments = await this.getAllByUserId(userId);
    const startFormatted = startDate.toISOString().split('T')[0];
    const endFormatted = endDate.toISOString().split('T')[0];
    
    return allAppointments.filter(appointment => {
      const appointmentDate = appointment.date;
      return appointmentDate >= startFormatted && appointmentDate <= endFormatted;
    });
  }

  async getByClientId(clientId: string, userId?: string): Promise<Appointment[]> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const allAppointments = await this.getAllByUserId(userId);
    
    return allAppointments.filter(appointment => 
      appointment.clientId === clientId
    );
  }

  async getByStatus(status: string, userId?: string): Promise<Appointment[]> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const allAppointments = await this.getAllByUserId(userId);
    
    return allAppointments.filter(appointment => 
      appointment.status === status
    );
  }
}

// Create singleton instance
export const appointmentRepository = new AppointmentRepository();
