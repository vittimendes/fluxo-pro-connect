
import { User } from '../types/user';
import { users } from './store';
import { generateUniqueId } from './utils';

export const mockAuthService = {
  login: (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        resolve(user || null);
      }, 800); // Simulating network delay
    });
  },
  
  register: (userData: Omit<User, 'id'>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUserId = generateUniqueId('user');
        const newUser = {
          ...userData,
          id: newUserId
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save to localStorage for demo persistence
        mockAuthService.saveUser(newUser);
        
        resolve(newUser);
      }, 800);
    });
  },
  
  getCurrentUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check localStorage for saved user
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          resolve(JSON.parse(savedUser));
        } else {
          resolve(null);
        }
      }, 300);
    });
  },
  
  saveUser: (user: User): void => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem('currentUser');
      setTimeout(resolve, 300);
    });
  },
  
  updateProfile: (userData: Partial<User>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          const updatedUser = { ...currentUser, ...userData };
          
          // Update in the users array
          const userIndex = users.findIndex(u => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = updatedUser;
          }
          
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          resolve(updatedUser);
        } else {
          // Just for the mock, default to first user
          const updatedUser = { ...users[0], ...userData };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          resolve(updatedUser);
        }
      }, 500);
    });
  }
};
