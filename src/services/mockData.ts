
// Mock data for the MVP

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
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show';
  notes?: string;
}

export interface FinancialRecord {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO format
  type: 'income' | 'expense';
  category?: string;
  relatedAppointment?: string;
}

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

const clients: Client[] = [
  { id: '1', name: 'Maria Fernandes', phone: '5511988881111', email: 'maria@email.com', feedbackStatus: 'completed' },
  { id: '2', name: 'João Carlos', phone: '5511988882222', notes: 'Primeira consulta', feedbackStatus: 'pending' },
  { id: '3', name: 'Carla Mendes', phone: '5511988883333', feedbackStatus: 'not_sent' },
  { id: '4', name: 'Roberto Alves', phone: '5511988884444', feedbackStatus: 'not_sent' },
  { id: '5', name: 'Patrícia Lima', phone: '5511988885555', email: 'patricia@email.com', feedbackStatus: 'pending' }
];

// Today and tomorrow for initial data
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

// Function to format date to ISO string but only the date part
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const appointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Maria Fernandes',
    type: 'Terapia Individual',
    date: formatDate(today),
    time: '09:00',
    duration: 50,
    location: 'online',
    status: 'scheduled'
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
    status: 'scheduled'
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
    status: 'scheduled'
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
    status: 'scheduled'
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
    status: 'scheduled'
  }
];

// Mock financial records
const financialRecords: FinancialRecord[] = [
  {
    id: '1',
    amount: 200,
    description: 'Consulta - Maria Fernandes',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
    type: 'income',
    relatedAppointment: '1'
  },
  {
    id: '2',
    amount: 250,
    description: 'Avaliação - João Carlos',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
    type: 'income',
    relatedAppointment: '2'
  },
  {
    id: '3',
    amount: -80,
    description: 'Material de escritório',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
    type: 'expense',
    category: 'Suprimentos'
  },
  {
    id: '4',
    amount: -150,
    description: 'Assinatura plataforma de agendamento',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    type: 'expense',
    category: 'Serviços'
  },
  {
    id: '5',
    amount: 200,
    description: 'Consulta - Patrícia Lima',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
    type: 'income',
    relatedAppointment: '5'
  }
];

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
  getClients: (): Promise<Client[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...clients]), 500);
    });
  },

  getAppointments: (): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...appointments]), 500);
    });
  },

  getTodayAppointments: (): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      const todayStr = formatDate(today);
      setTimeout(() => {
        const todayApps = appointments.filter(app => app.date === todayStr);
        resolve([...todayApps]);
      }, 500);
    });
  },

  getAppointmentsByDate: (date: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredApps = appointments.filter(app => app.date === date);
        resolve([...filteredApps]);
      }, 500);
    });
  },

  getAppointmentsByWeek: (startDate: Date, endDate: Date): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = formatDate(startDate);
        const end = formatDate(endDate);
        
        const filteredApps = appointments.filter(app => {
          return app.date >= start && app.date <= end;
        });
        
        resolve([...filteredApps]);
      }, 500);
    });
  },

  addAppointment: (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment = {
          ...appointment,
          id: `app_${appointments.length + 1}`,
        };
        appointments.push(newAppointment);
        resolve(newAppointment);
      }, 500);
    });
  },

  updateAppointment: (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = appointments.findIndex(app => app.id === id);
        if (index !== -1) {
          appointments[index] = { ...appointments[index], ...data };
          resolve(appointments[index]);
        } else {
          reject(new Error('Appointment not found'));
        }
      }, 500);
    });
  },

  deleteAppointment: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = appointments.findIndex(app => app.id === id);
        if (index !== -1) {
          appointments.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  getFinancialRecords: (): Promise<FinancialRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...financialRecords]), 500);
    });
  },

  getMonthlyFinancialSummary: (month: number, year: number): Promise<{ income: number, expenses: number, balance: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = financialRecords.filter(record => {
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
        const newRecord = {
          ...record,
          id: `fin_${financialRecords.length + 1}`,
        };
        financialRecords.push(newRecord);
        resolve(newRecord);
      }, 500);
    });
  },

  updateFinancialRecord: (id: string, data: Partial<FinancialRecord>): Promise<FinancialRecord> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = financialRecords.findIndex(record => record.id === id);
        if (index !== -1) {
          financialRecords[index] = { ...financialRecords[index], ...data };
          resolve(financialRecords[index]);
        } else {
          reject(new Error('Financial record not found'));
        }
      }, 500);
    });
  },

  deleteFinancialRecord: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = financialRecords.findIndex(record => record.id === id);
        if (index !== -1) {
          financialRecords.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
};
