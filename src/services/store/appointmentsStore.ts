
// @file appointmentsStore.ts
// Mock appointments data storage with initial demo appointments.

import { Appointment } from '../types';
import { formatDate } from '../utils';
import { today, tomorrow, nextWeek } from './dateUtils';

// @section User-specific appointments storage
export const appointmentsByUser: { [userId: string]: Appointment[] } = {};

// Helper function to create dates for mock data
const createDate = (year: number, month: number, day: number) => {
  return new Date(year, month, day);
};

// @section Initialize demo data for default user
appointmentsByUser['1'] = [
  // Original appointments
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
  },
  // January 2025 Appointments
  {
    id: '9',
    clientId: '1',
    clientName: 'Maria Fernandes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 0, 10)),
    time: '10:30',
    duration: 50,
    location: 'online',
    status: 'completed',
    userId: '1',
    notes: 'Evolução positiva na terapia'
  },
  {
    id: '10',
    clientId: '2',
    clientName: 'João Carlos',
    type: 'Avaliação Inicial',
    date: formatDate(createDate(2025, 0, 12)),
    time: '14:30',
    duration: 90,
    location: 'in_person',
    status: 'completed',
    userId: '1',
    notes: 'Cliente apresentou quadro de ansiedade'
  },
  {
    id: '11',
    clientId: '3',
    clientName: 'Carla Mendes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 0, 15)),
    time: '09:00',
    duration: 50,
    location: 'online',
    status: 'canceled',
    userId: '1',
    notes: 'Cliente cancelou por motivos pessoais'
  },
  {
    id: '12',
    clientId: '4',
    clientName: 'Roberto Alves',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 0, 18)),
    time: '16:30',
    duration: 50,
    location: 'in_person',
    status: 'completed',
    userId: '1'
  },
  {
    id: '13',
    clientId: '5',
    clientName: 'Patrícia Lima',
    type: 'Avaliação de Progresso',
    date: formatDate(createDate(2025, 0, 22)),
    time: '11:00',
    duration: 60,
    location: 'online',
    status: 'no_show',
    userId: '1',
    notes: 'Cliente não compareceu'
  },
  {
    id: '14',
    clientId: '1',
    clientName: 'Maria Fernandes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 0, 28)),
    time: '15:00',
    duration: 50,
    location: 'online',
    status: 'completed',
    userId: '1'
  },
  // February 2025 Appointments
  {
    id: '15',
    clientId: '2',
    clientName: 'João Carlos',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 1, 5)),
    time: '10:00',
    duration: 50,
    location: 'in_person',
    status: 'completed',
    userId: '1'
  },
  {
    id: '16',
    clientId: '3',
    clientName: 'Carla Mendes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 1, 7)),
    time: '14:30',
    duration: 50,
    location: 'online',
    status: 'completed',
    userId: '1',
    notes: 'Cliente relatou melhora nos sintomas'
  },
  {
    id: '17',
    clientId: '4',
    clientName: 'Roberto Alves',
    type: 'Avaliação de Progresso',
    date: formatDate(createDate(2025, 1, 12)),
    time: '09:30',
    duration: 60,
    location: 'in_person',
    status: 'completed',
    userId: '1'
  },
  {
    id: '18',
    clientId: '5',
    clientName: 'Patrícia Lima',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 1, 17)),
    time: '15:30',
    duration: 50,
    location: 'online',
    status: 'canceled',
    userId: '1',
    notes: 'Cliente precisou remarcar'
  },
  {
    id: '19',
    clientId: '1',
    clientName: 'Maria Fernandes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 1, 20)),
    time: '11:00',
    duration: 50,
    location: 'online',
    status: 'completed',
    userId: '1'
  },
  {
    id: '20',
    clientId: '2',
    clientName: 'João Carlos',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 1, 26)),
    time: '16:00',
    duration: 50,
    location: 'in_person',
    status: 'no_show',
    userId: '1',
    notes: 'Cliente não avisou que faltaria'
  },
  // March 2025 Appointments
  {
    id: '21',
    clientId: '3',
    clientName: 'Carla Mendes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 2, 3)),
    time: '10:00',
    duration: 50,
    location: 'in_person',
    status: 'completed',
    userId: '1'
  },
  {
    id: '22',
    clientId: '4',
    clientName: 'Roberto Alves',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 2, 8)),
    time: '14:00',
    duration: 50,
    location: 'home_visit',
    status: 'completed',
    userId: '1',
    notes: 'Visita domiciliar produtiva'
  },
  {
    id: '23',
    clientId: '5',
    clientName: 'Patrícia Lima',
    type: 'Avaliação de Progresso',
    date: formatDate(createDate(2025, 2, 15)),
    time: '11:30',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '1'
  },
  {
    id: '24',
    clientId: '1',
    clientName: 'Maria Fernandes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 2, 18)),
    time: '09:00',
    duration: 50,
    location: 'online',
    status: 'canceled',
    userId: '1',
    notes: 'Problema técnico na conexão'
  },
  {
    id: '25',
    clientId: '2',
    clientName: 'João Carlos',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 2, 22)),
    time: '15:00',
    duration: 50,
    location: 'in_person',
    status: 'completed',
    userId: '1'
  },
  {
    id: '26',
    clientId: '3',
    clientName: 'Carla Mendes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 2, 29)),
    time: '16:30',
    duration: 50,
    location: 'online',
    status: 'completed',
    userId: '1',
    notes: 'Discussão sobre novas estratégias'
  },
  // April 2025 Appointments
  {
    id: '27',
    clientId: '4',
    clientName: 'Roberto Alves',
    type: 'Avaliação de Progresso',
    date: formatDate(createDate(2025, 3, 5)),
    time: '10:30',
    duration: 60,
    location: 'in_person',
    status: 'completed',
    userId: '1'
  },
  {
    id: '28',
    clientId: '5',
    clientName: 'Patrícia Lima',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 3, 10)),
    time: '14:00',
    duration: 50,
    location: 'online',
    status: 'no_show',
    userId: '1',
    notes: 'Cliente esqueceu da sessão'
  },
  {
    id: '29',
    clientId: '1',
    clientName: 'Maria Fernandes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 3, 14)),
    time: '09:30',
    duration: 50,
    location: 'online',
    status: 'completed',
    userId: '1',
    notes: 'Progresso consistente'
  },
  {
    id: '30',
    clientId: '2',
    clientName: 'João Carlos',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 3, 19)),
    time: '15:30',
    duration: 50,
    location: 'in_person',
    status: 'completed',
    userId: '1'
  },
  {
    id: '31',
    clientId: '3',
    clientName: 'Carla Mendes',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 3, 24)),
    time: '11:00',
    duration: 50,
    location: 'online',
    status: 'completed',
    userId: '1'
  },
  {
    id: '32',
    clientId: '4',
    clientName: 'Roberto Alves',
    type: 'Terapia Individual',
    date: formatDate(createDate(2025, 3, 29)),
    time: '16:00',
    duration: 50,
    location: 'home_visit',
    status: 'completed',
    userId: '1',
    notes: 'Última sessão do mês'
  }
];

// @section Initialize appointments for Vitor (Pro user)
appointmentsByUser['2'] = [
  // Original appointments
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
  },
  // January 2025 Appointments for Vitor
  {
    id: '33',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 0, 8)),
    time: '09:00',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2',
    notes: 'Discussão sobre metas anuais'
  },
  {
    id: '34',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Consulta Avançada',
    date: formatDate(createDate(2025, 0, 15)),
    time: '14:00',
    duration: 90,
    location: 'in_person',
    status: 'completed',
    userId: '2',
    notes: 'Primeira consulta do ano'
  },
  {
    id: '35',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 0, 22)),
    time: '10:30',
    duration: 60,
    location: 'online',
    status: 'canceled',
    userId: '2',
    notes: 'Cliente precisou cancelar'
  },
  {
    id: '36',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 0, 29)),
    time: '15:00',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2',
    notes: 'Sessão de acompanhamento mensal'
  },
  // February 2025 Appointments for Vitor
  {
    id: '37',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 1, 5)),
    time: '09:30',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2'
  },
  {
    id: '38',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Consulta Avançada',
    date: formatDate(createDate(2025, 1, 12)),
    time: '14:00',
    duration: 90,
    location: 'in_person',
    status: 'no_show',
    userId: '2',
    notes: 'Cliente não compareceu sem aviso'
  },
  {
    id: '39',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 1, 19)),
    time: '10:00',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2'
  },
  {
    id: '40',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 1, 26)),
    time: '15:30',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2',
    notes: 'Progresso satisfatório'
  },
  // March 2025 Appointments for Vitor
  {
    id: '41',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 2, 5)),
    time: '09:00',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2'
  },
  {
    id: '42',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Consulta Avançada',
    date: formatDate(createDate(2025, 2, 12)),
    time: '14:30',
    duration: 90,
    location: 'in_person',
    status: 'completed',
    userId: '2',
    notes: 'Consulta trimestral aprofundada'
  },
  {
    id: '43',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 2, 19)),
    time: '10:30',
    duration: 60,
    location: 'online',
    status: 'canceled',
    userId: '2',
    notes: 'Reagendado para próxima semana'
  },
  {
    id: '44',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 2, 26)),
    time: '10:30',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2',
    notes: 'Sessão remarcada'
  },
  // April 2025 Appointments for Vitor
  {
    id: '45',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 3, 2)),
    time: '15:00',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2'
  },
  {
    id: '46',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 3, 9)),
    time: '09:30',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2',
    notes: 'Revisão de objetivos'
  },
  {
    id: '47',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Consulta Avançada',
    date: formatDate(createDate(2025, 3, 16)),
    time: '14:00',
    duration: 90,
    location: 'in_person',
    status: 'completed',
    userId: '2'
  },
  {
    id: '48',
    clientId: '6',
    clientName: 'Lucas Oliveira',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 3, 23)),
    time: '10:00',
    duration: 60,
    location: 'online',
    status: 'no_show',
    userId: '2',
    notes: 'Cliente não compareceu'
  },
  {
    id: '49',
    clientId: '7',
    clientName: 'Amanda Santos',
    type: 'Mentoria',
    date: formatDate(createDate(2025, 3, 30)),
    time: '15:30',
    duration: 60,
    location: 'online',
    status: 'completed',
    userId: '2',
    notes: 'Última sessão do mês'
  }
];
