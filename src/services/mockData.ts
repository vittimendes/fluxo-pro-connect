export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profession: string;
  workHours: string;
  cancelPolicy: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  feedbackStatus?: 'pending' | 'completed' | 'not_sent';
  userId?: string; // To associate client with specific user
}

export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  userId: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  date: string; // ISO format
  time: string;
  duration: number; // in minutes
  location: 'online' | 'in_person' | 'home_visit';
  status: 'scheduled' | 'confirmed' | 'canceled' | 'no_show' | 'completed';
  notes?: string;
  userId?: string; // To associate appointment with specific user
}

export interface FinancialRecord {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO format
  type: 'income' | 'expense';
  category?: string;
  relatedAppointment?: string;
  clientId?: string; // To associate with client
  userId?: string; // To associate financial record with specific user
  clientName?: string; // Add clientName property
  appointmentId?: string; // Add appointmentId property
  notes?: string; // Add notes property
}

// Demo user data
const users: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@exemplo.com',
    password: '123456',
    profession: 'Psicóloga',
    workHours: 'Segunda a Sexta, 8h às 18h',
    cancelPolicy: 'Cancelamentos devem ser feitos com 24h de antecedência para evitar cobrança.',
    whatsappNumber: '5511999999999',
    defaultMessage: 'Olá! Sou a Ana Silva, psicóloga. Como posso ajudar?'
  }
];

// Client data (shared for demo purposes)
const clients: Client[] = [
  { id: '1', name: 'Maria Fernandes', phone: '5511988881111', email: 'maria@email.com', feedbackStatus: 'completed', userId: '1' },
  { id: '2', name: 'João Carlos', phone: '5511988882222', notes: 'Primeira consulta', feedbackStatus: 'pending', userId: '1' },
  { id: '3', name: 'Carla Mendes', phone: '5511988883333', feedbackStatus: 'not_sent', userId: '1' },
  { id: '4', name: 'Roberto Alves', phone: '5511988884444', feedbackStatus: 'not_sent', userId: '1' },
  { id: '5', name: 'Patrícia Lima', phone: '5511988885555', email: 'patricia@email.com', feedbackStatus: 'pending', userId: '1' }
];

// Default appointment types
const appointmentTypes: AppointmentType[] = [
  { id: '1', name: 'Terapia Individual', description: 'Sessão de terapia individual', userId: '1' },
  { id: '2', name: 'Avaliação Inicial', description: 'Primeira consulta para avaliação', userId: '1' },
  { id: '3', name: 'Avaliação de Progresso', description: 'Revisão do progresso do tratamento', userId: '1' },
];

// Today and tomorrow for initial data
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

// Function to format date to ISO string but only the date part
const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Storage for user-specific data
const appointmentsByUser: { [userId: string]: Appointment[] } = {};
const financialRecordsByUser: { [userId: string]: FinancialRecord[] } = {};
const clientsByUser: { [userId: string]: Client[] } = {};
const appointmentTypesByUser: { [userId: string]: AppointmentType[] } = {};

// Initialize demo data for default user
appointmentsByUser['1'] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Maria Fernandes',
    type: 'Terapia Individual',
    date: formatDate(today),
    time: '09:00',
    duration: 50,
    location: 'online',
    status: 'scheduled',
    userId: '1'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'João Carlos',
    type: 'Avaliação Inicial',
    date: formatDate(today),
    time: '11:00',
    duration: 90,
    location: 'in_person',
    status: 'scheduled',
    userId: '1'
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Carla Mendes',
    type: 'Terapia Individual',
    date: formatDate(tomorrow),
    time: '14:00',
    duration: 50,
    location: 'in_person',
    status: 'scheduled',
    userId: '1'
  },
  {
    id: '4',
    clientId: '4',
    clientName: 'Roberto Alves',
    type: 'Terapia Individual',
    date: formatDate(tomorrow),
    time: '16:00',
    duration: 50,
    location: 'home_visit',
    status: 'scheduled',
    userId: '1'
  },
  {
    id: '5',
    clientId: '5',
    clientName: 'Patrícia Lima',
    type: 'Avaliação de Progresso',
    date: formatDate(today),
    time: '15:30',
    duration: 50,
    location: 'online',
    status: 'scheduled',
    userId: '1'
  }
];

// Initialize demo financial records for default user
financialRecordsByUser['1'] = [
  {
    id: '1',
    amount: 200,
    description: 'Consulta - Maria Fernandes',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
    type: 'income',
    relatedAppointment: '1',
    userId: '1'
  },
  {
    id: '2',
    amount: 250,
    description: 'Avaliação - João Carlos',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
    type: 'income',
    relatedAppointment: '2',
    userId: '1'
  },
  {
    id: '3',
    amount: -80,
    description: 'Material de escritório',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
    type: 'expense',
    category: 'Suprimentos',
    userId: '1'
  },
  {
    id: '4',
    amount: -150,
    description: 'Assinatura plataforma de agendamento',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    type: 'expense',
    category: 'Serviços',
    userId: '1'
  },
  {
    id: '5',
    amount: 200,
    description: 'Consulta - Patrícia Lima',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
    type: 'income',
    relatedAppointment: '5',
    userId: '1'
  }
];

// Initialize clients for default user
clientsByUser['1'] = [...clients];

// Initialize appointment types for default user
appointmentTypesByUser['1'] = [...appointmentTypes];

// Generate a unique ID based on timestamp and random number
const generateUniqueId = (prefix: string) => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Service functions to interact with mock data
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
        
        // Initialize empty appointments and financial records for this user
        appointmentsByUser[newUserId] = [];
        financialRecordsByUser[newUserId] = [];
        
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

export const mockDataService = {
  // Client methods
  getClients: (userId?: string): Promise<Client[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const userClients = clientsByUser[userId] || [];
        resolve([...userClients]);
      }, 500);
    });
  },

  addClient: (client: Omit<Client, 'id'>): Promise<Client> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
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
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
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
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
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

  // Appointment types methods
  getAppointmentTypes: (userId?: string): Promise<AppointmentType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const userAppointmentTypes = appointmentTypesByUser[userId] || [];
        resolve([...userAppointmentTypes]);
      }, 500);
    });
  },

  addAppointmentType: (appointmentType: Omit<AppointmentType, 'id'>): Promise<AppointmentType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        const newAppointmentType = {
          ...appointmentType,
          id: generateUniqueId('type'),
          userId
        };
        
        if (!appointmentTypesByUser[userId]) {
          appointmentTypesByUser[userId] = [];
        }
        
        appointmentTypesByUser[userId].push(newAppointmentType);
        resolve(newAppointmentType);
      }, 500);
    });
  },

  updateAppointmentType: (id: string, data: Partial<AppointmentType>): Promise<AppointmentType> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        if (!appointmentTypesByUser[userId]) {
          reject(new Error('No appointment types found for this user'));
          return;
        }
        
        const index = appointmentTypesByUser[userId].findIndex(type => type.id === id);
        if (index !== -1) {
          appointmentTypesByUser[userId][index] = { ...appointmentTypesByUser[userId][index], ...data };
          resolve(appointmentTypesByUser[userId][index]);
        } else {
          reject(new Error('Appointment type not found'));
        }
      }, 500);
    });
  },

  deleteAppointmentType: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        if (!appointmentTypesByUser[userId]) {
          resolve(false);
          return;
        }
        
        const index = appointmentTypesByUser[userId].findIndex(type => type.id === id);
        if (index !== -1) {
          appointmentTypesByUser[userId].splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  // Appointment methods
  getAppointments: (userId?: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const userAppointments = appointmentsByUser[userId] || [];
        resolve([...userAppointments]);
      }, 500);
    });
  },

  getTodayAppointments: (userId?: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      const todayStr = formatDate(today);
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const userAppointments = appointmentsByUser[userId] || [];
        const todayApps = userAppointments.filter(app => app.date === todayStr);
        resolve([...todayApps]);
      }, 500);
    });
  },

  getAppointmentsByDate: (date: string, userId?: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const userAppointments = appointmentsByUser[userId] || [];
        const filteredApps = userAppointments.filter(app => app.date === date);
        resolve([...filteredApps]);
      }, 500);
    });
  },

  getAppointmentsByWeek: (startDate: Date, endDate: Date, userId?: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const start = formatDate(startDate);
        const end = formatDate(endDate);
        
        const userAppointments = appointmentsByUser[userId] || [];
        const filteredApps = userAppointments.filter(app => {
          return app.date >= start && app.date <= end;
        });
        
        resolve([...filteredApps]);
      }, 500);
    });
  },

  addAppointment: (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        const newAppointment = {
          ...appointment,
          id: generateUniqueId('app'),
          userId
        };
        
        if (!appointmentsByUser[userId]) {
          appointmentsByUser[userId] = [];
        }
        
        appointmentsByUser[userId].push(newAppointment);
        resolve(newAppointment);
      }, 500);
    });
  },

  updateAppointment: (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        if (!appointmentsByUser[userId]) {
          reject(new Error('No appointments found for this user'));
          return;
        }
        
        const index = appointmentsByUser[userId].findIndex(app => app.id === id);
        if (index !== -1) {
          appointmentsByUser[userId][index] = { ...appointmentsByUser[userId][index], ...data };
          resolve(appointmentsByUser[userId][index]);
        } else {
          reject(new Error('Appointment not found'));
        }
      }, 500);
    });
  },

  deleteAppointment: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        if (!appointmentsByUser[userId]) {
          resolve(false);
          return;
        }
        
        const index = appointmentsByUser[userId].findIndex(app => app.id === id);
        if (index !== -1) {
          appointmentsByUser[userId].splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
  
  executeAppointment: (id: string, financialData?: { amount: number, description: string, type: 'income' | 'expense' }): Promise<{ appointment: Appointment, financialRecord?: FinancialRecord }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        if (!appointmentsByUser[userId]) {
          reject(new Error('No appointments found for this user'));
          return;
        }
        
        // Update appointment status to completed
        const index = appointmentsByUser[userId].findIndex(app => app.id === id);
        if (index === -1) {
          reject(new Error('Appointment not found'));
          return;
        }
        
        appointmentsByUser[userId][index] = { 
          ...appointmentsByUser[userId][index], 
          status: 'completed' 
        };
        
        const updatedAppointment = appointmentsByUser[userId][index];
        
        // Create a financial record if data is provided
        if (financialData) {
          const newRecord: FinancialRecord = {
            id: generateUniqueId('fin'),
            amount: financialData.amount,
            description: financialData.description,
            date: formatDate(new Date()),
            type: financialData.type,
            relatedAppointment: id,
            userId
          };
          
          if (!financialRecordsByUser[userId]) {
            financialRecordsByUser[userId] = [];
          }
          
          financialRecordsByUser[userId].push(newRecord);
          
          resolve({
            appointment: updatedAppointment,
            financialRecord: newRecord
          });
        } else {
          resolve({
            appointment: updatedAppointment
          });
        }
      }, 500);
    });
  },

  // Financial record methods
  getFinancialRecords: (userId?: string): Promise<FinancialRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        resolve([...userRecords]);
      }, 500);
    });
  },

  getMonthlyFinancialSummary: (month: number, year: number, userId?: string): Promise<{ income: number, expenses: number, balance: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1'; // Default to first user if none found
          }
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        const records = userRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === month && recordDate.getFullYear() === year;
        });
        
        const income = records
          .filter(record => record.type === 'income')
          .reduce((sum, record) => sum + record.amount, 0);
          
        const expenses = records
          .filter(record => record.type === 'expense')
          .reduce((sum, record) => sum + Math.abs(record.amount), 0);
        
        resolve({
          income,
          expenses,
          balance: income - expenses
        });
      }, 500);
    });
  },

  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        const newRecord = {
          ...record,
          id: generateUniqueId('fin'),
          userId
        };
        
        if (!financialRecordsByUser[userId]) {
          financialRecordsByUser[userId] = [];
        }
        
        financialRecordsByUser[userId].push(newRecord);
        resolve(newRecord);
      }, 500);
    });
  },

  updateFinancialRecord: (id: string, data: Partial<FinancialRecord>): Promise<FinancialRecord> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        if (!financialRecordsByUser[userId]) {
          reject(new Error('No financial records found for this user'));
          return;
        }
        
        const index = financialRecordsByUser[userId].findIndex(record => record.id === id);
        if (index !== -1) {
          financialRecordsByUser[userId][index] = { ...financialRecordsByUser[userId][index], ...data };
          resolve(financialRecordsByUser[userId][index]);
        } else {
          reject(new Error('Financial record not found'));
        }
      }, 500);
    });
  },

  deleteFinancialRecord: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        if (!financialRecordsByUser[userId]) {
          resolve(false);
          return;
        }
        
        const index = financialRecordsByUser[userId].findIndex(record => record.id === id);
        if (index !== -1) {
          financialRecordsByUser[userId].splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
  
  getFinancialRecordsByAppointment: (appointmentId: string, userId?: string): Promise<FinancialRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1';
          }
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        const filteredRecords = userRecords.filter(
          record => record.relatedAppointment === appointmentId
        );
        
        resolve([...filteredRecords]);
      }, 500);
    });
  },

  // Add getClientById method
  getClientById: (id: string): Promise<Client | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        const userClients = clientsByUser[userId] || [];
        const client = userClients.find(client => client.id === id);
        
        resolve(client || null);
      }, 500);
    });
  },

  // Add getAppointmentsByClientId method
  getAppointmentsByClientId: (clientId: string, userId?: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1';
          }
        }
        
        const userAppointments = appointmentsByUser[userId] || [];
        const clientAppointments = userAppointments.filter(app => app.clientId === clientId);
        
        resolve([...clientAppointments]);
      }, 500);
    });
  },
  
  // Add getFinancialRecordsByClientId method
  getFinancialRecordsByClientId: (clientId: string, userId?: string): Promise<FinancialRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          const currentUserJson = localStorage.getItem('currentUser');
          if (currentUserJson) {
            const currentUser = JSON.parse(currentUserJson) as User;
            userId = currentUser.id;
          } else {
            userId = '1';
          }
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        const clientRecords = userRecords.filter(record => record.clientId === clientId);
        
        resolve([...clientRecords]);
      }, 500);
    });
  },
  
  // Add getFinancialRecordById method
  getFinancialRecordById: (id: number | string): Promise<FinancialRecord | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        let userId = '1';
        
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;
          userId = currentUser.id;
        }
        
        const recordId = typeof id === 'number' ? id.toString() : id;
        const userRecords = financialRecordsByUser[userId] || [];
        const record = userRecords.find(record => record.id === recordId);
        
        resolve(record || null);
      }, 500);
    });
  },
};
