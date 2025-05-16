
import { FinancialRecord } from '../types';
import { formatDate } from '../utils';
import { today } from './dateUtils';

// Storage for user-specific financial records
export const financialRecordsByUser: { [userId: string]: FinancialRecord[] } = {};

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
