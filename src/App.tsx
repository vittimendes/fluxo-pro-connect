
// @file App.tsx
// Main application entry point that sets up routing, providers,
// and the overall application structure.

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";

// @section Import page components
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import NovoAgendamento from "./pages/NovoAgendamento";
import Financeiro from "./pages/Financeiro";
import FinancialView from "./pages/FinancialView";
import NovoRegistroFinanceiro from "./pages/NovoRegistroFinanceiro";
import EditarRegistroFinanceiro from "./pages/EditarRegistroFinanceiro";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppointmentView from "./pages/AppointmentView";
import Register from "./pages/Register";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import ClientView from "./pages/ClientView";
import AppointmentTypes from "./pages/AppointmentTypes";

// @section Initialize React Query client
const queryClient = new QueryClient();

// @component Main application component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          {/* @component Global toast notifications */}
          <Toaster />
          <Sonner />
          
          {/* @section Application routes */}
          <Routes>
            {/* @section Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            
            {/* @section Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/agenda/novo" element={<NovoAgendamento />} />
                <Route path="/agenda/:id" element={<AppointmentView />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/financeiro/novo" element={<NovoRegistroFinanceiro />} />
                <Route path="/financeiro/:id" element={<FinancialView />} />
                <Route path="/financeiro/:id/editar" element={<EditarRegistroFinanceiro />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/clientes/novo" element={<ClientForm />} />
                <Route path="/clientes/:id" element={<ClientView />} />
                <Route path="/clientes/:id/editar" element={<ClientForm />} />
                <Route path="/tipos-de-atendimento" element={<AppointmentTypes />} />
                <Route path="/perfil" element={<Profile />} />
              </Route>
            </Route>
            
            {/* @section Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
