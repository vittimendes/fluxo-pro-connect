
import { Attachment } from '../types';

// Storage for user-specific attachments
export const attachmentsByUser: { [userId: string]: Attachment[] } = {};

// Initialize mock attachments for both users
attachmentsByUser['1'] = [
  {
    id: 'attachment_1',
    name: 'Foto do perfil.jpg',
    type: 'image/jpeg',
    size: 245000,
    url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80',
    clientId: '1', // Maria Fernandes
    userId: '1',
    dateUploaded: '2023-05-20',
    notes: 'Foto para documentação'
  },
  {
    id: 'attachment_2',
    name: 'Resultados exames.pdf',
    type: 'application/pdf',
    size: 1200000,
    url: '/placeholder.svg',
    clientId: '1', // Maria Fernandes
    userId: '1',
    dateUploaded: '2023-06-05',
    notes: 'Exames do último semestre'
  },
  {
    id: 'attachment_3',
    name: 'Formulário de entrada.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 85000,
    url: '/placeholder.svg',
    clientId: '2', // João Carlos
    userId: '1',
    dateUploaded: '2023-04-12'
  },
  {
    id: 'attachment_4',
    name: 'Planilha de acompanhamento.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 350000,
    url: '/placeholder.svg',
    clientId: '2', // João Carlos
    userId: '1',
    dateUploaded: '2023-07-18'
  }
];

// Vitor's client attachments (Pro user)
attachmentsByUser['2'] = [
  {
    id: 'attachment_5',
    name: 'Documentação inicial.pdf',
    type: 'application/pdf',
    size: 980000,
    url: '/placeholder.svg',
    clientId: '6', // Lucas Oliveira
    userId: '2',
    dateUploaded: '2023-08-15'
  },
  {
    id: 'attachment_6',
    name: 'Foto recente.jpg',
    type: 'image/jpeg',
    size: 320000,
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    clientId: '7', // Amanda Santos
    userId: '2',
    dateUploaded: '2023-09-01'
  }
];
