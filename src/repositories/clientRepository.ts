
import { BaseRepository } from '@/lib/repository';
import { ClientRepository as IClientRepository } from '@/types/repository';
import { Client } from '@/services/types';
import { clientsByUser } from '@/services/store';
import { generateUniqueId, getCurrentUserIdSync } from '@/services/utils';

export class ClientRepository extends BaseRepository<Client> implements IClientRepository<Client> {
  protected getStore() {
    return clientsByUser;
  }
  
  protected generateId(): string {
    return generateUniqueId('client');
  }

  async search(query: string, userId?: string): Promise<Client[]> {
    if (!userId) {
      userId = getCurrentUserIdSync();
    }
    
    const allClients = await this.getAllByUserId(userId);
    
    if (!query || query.trim() === '') {
      return allClients;
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    return allClients.filter(client => 
      client.name.toLowerCase().includes(normalizedQuery) || 
      client.phone.includes(normalizedQuery) ||
      (client.email && client.email.toLowerCase().includes(normalizedQuery))
    );
  }
}

// Create singleton instance
export const clientRepository = new ClientRepository();
