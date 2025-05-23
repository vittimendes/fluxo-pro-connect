
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from '@/services/types';
import { AppointmentFormData } from '@/types/forms';
import { format } from 'date-fns';

export class SupabaseAppointmentRepository {
  async getAll(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
    
    return data.map(this.mapToAppointment);
  }

  async getById(id: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching appointment:', error);
      throw new Error('Failed to fetch appointment');
    }
    
    return this.mapToAppointment(data);
  }

  async getByDate(date: Date): Promise<Appointment[]> {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', formattedDate)
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments by date:', error);
      throw new Error('Failed to fetch appointments by date');
    }
    
    return data.map(this.mapToAppointment);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    const startFormatted = format(startDate, 'yyyy-MM-dd');
    const endFormatted = format(endDate, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', startFormatted)
      .lte('date', endFormatted)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments by date range:', error);
      throw new Error('Failed to fetch appointments by date range');
    }
    
    return data.map(this.mapToAppointment);
  }

  async getByClientId(clientId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching appointments by client:', error);
      throw new Error('Failed to fetch appointments by client');
    }
    
    return data.map(this.mapToAppointment);
  }

  async getByStatus(status: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', status)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments by status:', error);
      throw new Error('Failed to fetch appointments by status');
    }
    
    return data.map(this.mapToAppointment);
  }

  async create(formData: AppointmentFormData): Promise<Appointment> {
    // Format date correctly
    const formattedDate = typeof formData.date === 'string' 
      ? formData.date 
      : format(formData.date, 'yyyy-MM-dd');

    // Format duration as number
    const duration = typeof formData.duration === 'string'
      ? parseInt(formData.duration)
      : formData.duration;

    // Prepare data for Supabase
    const appointmentData = {
      client_id: formData.clientId,
      client_name: formData.clientName,
      type: formData.type,
      date: formattedDate,
      time: formData.time,
      duration: duration,
      location: formData.location,
      status: formData.status,
      notes: formData.notes || '',
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      throw new Error(`Failed to create appointment: ${error.message}`);
    }

    return this.mapToAppointment(data);
  }

  async update(id: string, formData: Partial<AppointmentFormData>): Promise<Appointment> {
    // Prepare update object
    const updateData: Record<string, any> = {};

    // Only add fields that are present in formData
    if (formData.clientId !== undefined) updateData.client_id = formData.clientId;
    if (formData.clientName !== undefined) updateData.client_name = formData.clientName;
    if (formData.type !== undefined) updateData.type = formData.type;
    if (formData.time !== undefined) updateData.time = formData.time;
    if (formData.location !== undefined) updateData.location = formData.location;
    if (formData.status !== undefined) updateData.status = formData.status;
    if (formData.notes !== undefined) updateData.notes = formData.notes || '';
    
    // Format duration as number if present
    if (formData.duration !== undefined) {
      updateData.duration = typeof formData.duration === 'string'
        ? parseInt(formData.duration)
        : formData.duration;
    }

    // Format date if present
    if (formData.date !== undefined) {
      updateData.date = typeof formData.date === 'string' 
        ? formData.date 
        : format(formData.date, 'yyyy-MM-dd');
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment:', error);
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
    
    return this.mapToAppointment(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      throw new Error('Failed to delete appointment');
    }
    
    return true;
  }

  private mapToAppointment(data: any): Appointment {
    return {
      id: data.id,
      clientId: data.client_id,
      clientName: data.client_name,
      type: data.type,
      date: data.date,
      time: data.time,
      duration: data.duration,
      location: data.location,
      status: data.status,
      notes: data.notes || '',
      userId: data.user_id,
    };
  }
}

export const supabaseAppointmentRepository = new SupabaseAppointmentRepository();
