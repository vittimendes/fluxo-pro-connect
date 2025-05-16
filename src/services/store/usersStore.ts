
import { User } from '../../types/user';

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
