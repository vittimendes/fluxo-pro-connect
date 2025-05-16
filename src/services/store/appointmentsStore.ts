
import { Appointment } from '../types';
import { formatDate } from '../utils';
import { today, tomorrow, nextWeek } from './dateUtils';

// Storage for user-specific appointments data
export const appointmentsByUser: { [userId: string]: Appointment[] } = {};

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
