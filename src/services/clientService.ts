
import { Client } from './types';
import { clientsByUser } from './store';
import { generateUniqueId, getCurrentUserIdSync } from './utils';

export const clientService = {
  getClients: (userId?: string): Promise<Client[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          userId = getCurrentUserIdSync();
        }
        
        const userClients = clientsByUser[userId] || [];
        resolve([...userClients]);
      }, 500);
    });
  },

  getClientById: (id: string): Promise<Client | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        const userClients = clientsByUser[userId] || [];
        const client = userClients.find(client => client.id === id);
        
        resolve(client || null);
      }, 500);
    });
  },

  addClient: (client: Omit<Client, 'id'>): Promise<Client> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        const newClient = {
          ...client,
          id: generateUniqueId('client'),
          userId
        };
        
        if (!clientsByUser[userId]) {
          clientsByUser[userId] = [];
        }
        
        clientsByUser[userId].push(newClient);
        resolve(newClient);
      }, 500);
    });
  },

  updateClient: (id: string, data: Partial<Client>): Promise<Client> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        if (!clientsByUser[userId]) {
          reject(new Error('No clients found for this user'));
          return;
        }
        
        const index = clientsByUser[userId].findIndex(client => client.id === id);
        if (index !== -1) {
          clientsByUser[userId][index] = { ...clientsByUser[userId][index], ...data };
          resolve(clientsByUser[userId][index]);
        } else {
          reject(new Error('Client not found'));
        }
      }, 500);
    });
  },

  deleteClient: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        if (!clientsByUser[userId]) {
          resolve(false);
          return;
        }
        
        const index = clientsByUser[userId].findIndex(client => client.id === id);
        if (index !== -1) {
          clientsByUser[userId].splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
};
