
import { Repository, UserScopedRepository } from '@/types/repository';
import { getCurrentUserIdSync } from '@/services/utils';

/**
 * Base implementation for a repository that works with in-memory data store
 */
export abstract class BaseRepository<T extends { id: string; userId: string }, ID = string> 
  implements UserScopedRepository<T, ID> {
  
  protected abstract getStore(): { [userId: string]: T[] };
  
  protected abstract generateId(): string;
  
  async getAll(): Promise<T[]> {
    const userId = getCurrentUserIdSync();
    return this.getAllByUserId(userId);
  }

  async getAllByUserId(userId: string): Promise<T[]> {
    const store = this.getStore();
    return store[userId] || [];
  }

  async getById(id: ID): Promise<T | null> {
    const userId = getCurrentUserIdSync();
    const store = this.getStore();
    const items = store[userId] || [];
    return items.find(item => item.id === id) || null;
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const userId = getCurrentUserIdSync();
    const store = this.getStore();
    
    if (!store[userId]) {
      store[userId] = [];
    }
    
    const newItem = {
      ...item as any,
      id: this.generateId(),
      userId,
    } as T;
    
    store[userId].push(newItem);
    return newItem;
  }

  async update(id: ID, updates: Partial<T>): Promise<T> {
    const userId = getCurrentUserIdSync();
    const store = this.getStore();
    
    if (!store[userId]) {
      throw new Error('User has no data in this store');
    }
    
    const index = store[userId].findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    store[userId][index] = { ...store[userId][index], ...updates };
    return store[userId][index];
  }

  async delete(id: ID): Promise<boolean> {
    const userId = getCurrentUserIdSync();
    const store = this.getStore();
    
    if (!store[userId]) {
      return false;
    }
    
    const index = store[userId].findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    
    store[userId].splice(index, 1);
    return true;
  }
}
