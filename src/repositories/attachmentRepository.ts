
import { BaseRepository } from '@/lib/repository';
import { Attachment } from '@/services/types';
import { attachmentsByUser } from '@/services/store/attachmentsStore';
import { generateUniqueId, getCurrentUserIdSync, formatDate } from '@/services/utils';

export interface AttachmentRepositoryType {
  getAll(): Promise<Attachment[]>;
  getAllByUserId(userId: string): Promise<Attachment[]>;
  getById(id: string): Promise<Attachment | null>;
  getByClientId(clientId: string, userId?: string): Promise<Attachment[]>;
  create(item: Omit<Attachment, 'id' | 'userId' | 'dateUploaded'>): Promise<Attachment>;
  delete(id: string): Promise<boolean>;
}

export class AttachmentRepository extends BaseRepository<Attachment> implements AttachmentRepositoryType {
  protected getStore() {
    return attachmentsByUser;
  }

  protected generateId(): string {
    return generateUniqueId('attachment');
  }

  async getByClientId(clientId: string, userId?: string): Promise<Attachment[]> {
    if (!userId) userId = getCurrentUserIdSync();
    const all = await this.getAllByUserId(userId);
    return all.filter(a => a.clientId === clientId);
  }

  async create(item: Omit<Attachment, 'id' | 'userId' | 'dateUploaded'>): Promise<Attachment> {
    const userId = getCurrentUserIdSync();
    const newAttachment: Attachment = {
      ...item,
      id: this.generateId(),
      userId,
      dateUploaded: formatDate(new Date()),
    };
    if (!attachmentsByUser[userId]) attachmentsByUser[userId] = [];
    attachmentsByUser[userId].push(newAttachment);
    return newAttachment;
  }

  async delete(id: string): Promise<boolean> {
    const userId = getCurrentUserIdSync();
    if (!attachmentsByUser[userId]) return false;
    const idx = attachmentsByUser[userId].findIndex(a => a.id === id);
    if (idx !== -1) {
      attachmentsByUser[userId].splice(idx, 1);
      return true;
    }
    return false;
  }
}

export const attachmentRepository = new AttachmentRepository();
