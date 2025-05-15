
import { User, Client, AppointmentType, Appointment, FinancialRecord } from './types';
import { formatDate } from './utils';

// Demo user data
export const users: User[] = [
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
export const clients: Client[] = [
  { id: '1', name: 'Maria Fernandes', phone: '5511988881111', email: 'maria@email.com', feedbackStatus: 'completed', userId: '1' },
  { id: '2', name: 'João Carlos', phone: '5511988882222', notes: 'Primeira consulta', feedbackStatus: 'pending', userId: '1' },
  { id: '3', name: 'Carla Mendes', phone: '5511988883333', feedbackStatus: 'not_sent', userId: '1' },
  { id: '4', name: 'Roberto Alves', phone: '5511988884444', feedbackStatus: 'not_sent', userId: '1' },
  { id: '5', name: 'Patrícia Lima', phone: '5511988885555', email: 'patricia@email.com', feedbackStatus: 'pending', userId: '1' }
];

// Default appointment types
export const appointmentTypes: AppointmentType[] = [
  { id: '1', name: 'Terapia Individual', description: 'Sessão de terapia individual', userId: '1' },
  { id: '2', name: 'Avaliação Inicial', description: 'Primeira consulta para avaliação', userId: '1' },
  { id: '3', name: 'Avaliação de Progresso', description: 'Revisão do progresso do tratamento', userId: '1' },
];

// Today and tomorrow for initial data
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

// Storage for user-specific data
export const appointmentsByUser: { [userId: string]: Appointment[] } = {};
export const financialRecordsByUser: { [userId: string]: FinancialRecord[] } = {};
export const clientsByUser: { [userId: string]: Client[] } = {};
export const appointmentTypesByUser: { [userId: string]: AppointmentType[] } = {};

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
