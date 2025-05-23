
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/AppLayout';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { SupabasePrivateRoute } from '@/components/SupabasePrivateRoute';
import Auth from '@/pages/Auth';

// Pages
import Dashboard from '@/pages/Dashboard';
import Agenda from '@/pages/Agenda';
import Clients from '@/pages/Clients';
import ClientView from '@/pages/ClientView';
import ClientForm from '@/pages/ClientForm';
import NovoAgendamento from '@/pages/NovoAgendamento';
import AppointmentView from '@/pages/AppointmentView';
import AppointmentTypes from '@/pages/AppointmentTypes';
import Financeiro from '@/pages/Financeiro';
import NovoRegistroFinanceiro from '@/pages/NovoRegistroFinanceiro';
import FinancialView from '@/pages/FinancialView';
import EditarRegistroFinanceiro from '@/pages/EditarRegistroFinanceiro';
import Landing from '@/pages/Landing';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

import './App.css';

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route element={<SupabasePrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/agenda/:id" element={<AppointmentView />} />
              <Route path="/novo-agendamento" element={<NovoAgendamento />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/:id" element={<ClientView />} />
              <Route path="/clientes/novo" element={<ClientForm />} />
              <Route path="/clientes/editar/:id" element={<ClientForm />} />
              <Route path="/tipos-agendamento" element={<AppointmentTypes />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/financeiro/novo" element={<NovoRegistroFinanceiro />} />
              <Route path="/financeiro/:id" element={<FinancialView />} />
              <Route path="/financeiro/editar/:id" element={<EditarRegistroFinanceiro />} />
              <Route path="/perfil" element={<Profile />} />
            </Route>
          </Route>
          
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
      <Toaster />
    </SupabaseAuthProvider>
  );
}

export default App;
