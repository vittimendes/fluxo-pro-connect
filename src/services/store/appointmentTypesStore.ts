
import { AppointmentType } from '../types';

// Default appointment types
export const appointmentTypes: AppointmentType[] = [
  { id: '1', name: 'Terapia Individual', description: 'Sessão de terapia individual', userId: '1' },
  { id: '2', name: 'Avaliação Inicial', description: 'Primeira consulta para avaliação', userId: '1' },
  { id: '3', name: 'Avaliação de Progresso', description: 'Revisão do progresso do tratamento', userId: '1' },
  // Vitor's appointment types (Pro user)
  { id: '4', name: 'Mentoria', description: 'Sessão de mentoria profissional', userId: '2' },
  { id: '5', name: 'Consulta Avançada', description: 'Consulta com técnicas avançadas', userId: '2' },
];

// Storage for user-specific appointment types
export const appointmentTypesByUser: { [userId: string]: AppointmentType[] } = {};

// Initialize appointment types for both users
appointmentTypesByUser['1'] = [...appointmentTypes.filter(type => type.userId === '1')];
appointmentTypesByUser['2'] = [...appointmentTypes.filter(type => type.userId === '2')];
