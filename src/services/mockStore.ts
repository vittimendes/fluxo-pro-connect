import { User, Client, AppointmentType, Appointment, FinancialRecord, Attachment } from './types';
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
    defaultMessage: 'Olá! Sou a Ana Silva, psicóloga. Como posso ajudar?',
    plan: 'free'
  },
  {
    id: '2',
    name: 'Vitor Andrade',
    email: 'vitor@exemplo.com',
    password: '123456',
    profession: 'Psicólogo',
    workHours: 'Segunda a Sexta, 9h às 19h',
    cancelPolicy: 'Cancelamentos devem ser feitos com 48h de antecedência para evitar cobrança.',
    whatsappNumber: '5511988887777',
    defaultMessage: 'Olá! Sou o Vitor Andrade, psicólogo. Como posso ajudar?',
    plan: 'pro'
  }
];

// Client data (shared for demo purposes)
export const clients: Client[] = [
  { id: '1', name: 'Maria Fernandes', phone: '5511988881111', email: 'maria@email.com', feedbackStatus: 'completed', userId: '1' },
  { id: '2', name: 'João Carlos', phone: '5511988882222', notes: 'Primeira consulta', feedbackStatus: 'pending', userId: '1' },
  { id: '3', name: 'Carla Mendes', phone: '5511988883333', feedbackStatus: 'not_sent', userId: '1' },
  { id: '4', name: 'Roberto Alves', phone: '5511988884444', feedbackStatus: 'not_sent', userId: '1' },
  { id: '5', name: 'Patrícia Lima', phone: '5511988885555', email: 'patricia@email.com', feedbackStatus: 'pending', userId: '1' },
  // Vitor's clients (Pro user)
  { id: '6', name: 'Lucas Oliveira', phone: '5511988886666', email: 'lucas@email.com', feedbackStatus: 'completed', userId: '2' },
  { id: '7', name: 'Amanda Santos', phone: '5511988887777', notes: 'Cliente recorrente', feedbackStatus: 'pending', userId: '2' }
];

// Default appointment types
export const appointmentTypes: AppointmentType[] = [
  { id: '1', name: 'Terapia Individual', description: 'Sessão de terapia individual', userId: '1' },
  { id: '2', name: 'Avaliação Inicial', description: 'Primeira consulta para avaliação', userId: '1' },
  { id: '3', name: 'Avaliação de Progresso', description: 'Revisão do progresso do tratamento', userId: '1' },
  // Vitor's appointment types (Pro user)
  { id: '4', name: 'Mentoria', description: 'Sessão de mentoria profissional', userId: '2' },
  { id: '5', name: 'Consulta Avançada', description: 'Consulta com técnicas avançadas', userId: '2' },
];

// Today and tomorrow for initial data
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

// Storage for user-specific data
export const appointmentsByUser: { [userId: string]: Appointment[] } = {};
export const financialRecordsByUser: { [userId: string]: FinancialRecord[] } = {};
export const clientsByUser: { [userId: string]: Client[] } = {};
export const appointmentTypesByUser: { [userId: string]: AppointmentType[] } = {};
export const attachmentsByUser: { [userId: string]: Attachment[] } = {};

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

// Initialize appointments for Vitor (Pro user)
appointmentsByUser['2'] = [
  {
    id: '6',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(tomorrow),
    time: '10:00',
    duration: 60,
    location: 'online',
    status: 'scheduled',
    userId: '2'
  },
  {
    id: '7',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Consulta Avançada',
    date: formatDate(nextWeek),
    time: '14:30',
    duration: 90,
    location: 'in_person',
    status: 'confirmed',
    userId: '2'
  },
  {
    id: '8',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(today),
    time: '16:00',
    duration: 60,
    location: 'online',
    status: 'scheduled',
    userId: '2'
  }
];

// Initialize financial records for Vitor (Pro user)
financialRecordsByUser['2'] = [
  {
    id: '6',
    amount: 300,
    description: 'Mentoria - Lucas Oliveira',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
    type: 'income',
    relatedAppointment: '6',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    userId: '2'
  },
  {
    id: '7',
    amount: 450,
    description: 'Consulta Avançada - Amanda Santos',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
    type: 'income',
    relatedAppointment: '7',
    clientId: '7',
    clientName: 'Amanda Santos',
    userId: '2'
  },
  {
    id: '8',
    amount: -120,
    description: 'Software para notas de sessão',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), 5)),
    type: 'expense',
    category: 'Software',
    userId: '2'
  }
];

// Initialize clients for both users
clientsByUser['1'] = [...clients.filter(client => client.userId === '1')];
clientsByUser['2'] = [...clients.filter(client => client.userId === '2')];

// Initialize appointment types for both users
appointmentTypesByUser['1'] = [...appointmentTypes.filter(type => type.userId === '1')];
appointmentTypesByUser['2'] = [...appointmentTypes.filter(type => type.userId === '2')];

// Initialize attachments for both users (empty arrays)
attachmentsByUser['1'] = [];
attachmentsByUser['2'] = [];
