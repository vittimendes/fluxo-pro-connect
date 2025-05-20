
/**
 * Generic repository interface that defines standard CRUD operations
 * for any entity type.
 */
export interface Repository<T, ID = string> {
  getAll(): Promise<T[]>;
  getById(id: ID): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: ID, item: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

/**
 * Extended repository interface for entities that can be filtered by user
 */
export interface UserScopedRepository<T, ID = string> extends Repository<T, ID> {
  getAllByUserId(userId: string): Promise<T[]>;
}

/**
 * Extended repository interface for financial records with specialized methods
 */
export interface FinancialRepository<T extends { date: string; amount: number }, ID = string> 
  extends UserScopedRepository<T, ID> {
  getByPeriod(startDate: Date, endDate: Date, userId?: string): Promise<T[]>;
  getByClientId(clientId: string, userId?: string): Promise<T[]>;
  getByCategory(category: string, userId?: string): Promise<T[]>;
  getSummary(startDate: Date, endDate: Date, userId?: string): Promise<{ income: number, expenses: number, balance: number }>;
}

/**
 * Extended repository interface for appointments
 */
export interface AppointmentRepository<T, ID = string> extends UserScopedRepository<T, ID> {
  getByDate(date: Date, userId?: string): Promise<T[]>;
  getByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<T[]>;
  getByClientId(clientId: string, userId?: string): Promise<T[]>;
  getByStatus(status: string, userId?: string): Promise<T[]>;
}

/**
 * Extended repository interface for clients
 */
export interface ClientRepository<T, ID = string> extends UserScopedRepository<T, ID> {
  search(query: string, userId?: string): Promise<T[]>;
}
