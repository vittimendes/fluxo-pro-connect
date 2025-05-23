
import { BaseRepository } from '@/lib/repository';
import { AppointmentType } from '@/services/types';
import { appointmentTypesByUser } from '@/services/store';
import { generateUniqueId, getCurrentUserIdSync } from '@/services/utils';

export class AppointmentTypeRepository extends BaseRepository<AppointmentType> {
  protected getStore() {
    return appointmentTypesByUser;
  }

  protected generateId(): string {
    return generateUniqueId('type');
  }
}

export const appointmentTypeRepository = new AppointmentTypeRepository();
