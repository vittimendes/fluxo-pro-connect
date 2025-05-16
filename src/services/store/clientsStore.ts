
import { Client } from '../types';

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

// Storage for user-specific clients data
export const clientsByUser: { [userId: string]: Client[] } = {};

// Initialize clients for both users
clientsByUser['1'] = [...clients.filter(client => client.userId === '1')];
clientsByUser['2'] = [...clients.filter(client => client.userId === '2')];
