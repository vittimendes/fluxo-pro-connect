
# Documentação Técnica - ProAgenda

Este documento fornece uma visão geral técnica do sistema ProAgenda, incluindo a estrutura de arquivos, funcionalidades principais, fluxos de dados e sugestões de melhorias.

## 🧭 1. Mapeamento de Funcionalidades Principais

### Dashboard
- **Descrição**: Página inicial que mostra resumo das atividades, compromissos do dia e resumo financeiro.
- **Implementação**: 
  - **Page**: `src/pages/Dashboard.tsx`
  - **Components**: `src/components/dashboard/` (DashboardHeader, QuickActions, FinancialSummary, TodayAppointments)
  - **Data Loader**: `src/components/dashboard/DashboardDataLoader.tsx`
- **Tipo**: Page + Components + DataLoader

### Agenda
- **Descrição**: Gerenciamento de compromissos e consultas, com visualizações diárias, semanais e mensais.
- **Implementação**:
  - **Page**: `src/pages/Agenda.tsx`
  - **Components**: `src/components/agenda/` (AgendaDayView, AgendaWeekView, AgendaMonthView, AgendaHeader, etc.)
  - **Appointment Views**: `src/pages/AppointmentView.tsx`, `src/pages/NovoAgendamento.tsx`
  - **Hooks**: `src/hooks/use-agenda.ts`, `src/hooks/use-appointment-status.ts`
  - **Services**: `src/services/appointmentService.ts`, `src/services/appointments/`
- **Tipo**: Page + Components + Hooks + Services

### Financeiro
- **Descrição**: Gerenciamento financeiro, incluindo receitas, despesas, análise e registro de transações.
- **Implementação**:
  - **Pages**: `src/pages/Financeiro.tsx`, `src/pages/FinancialView.tsx`, `src/pages/NovoRegistroFinanceiro.tsx`, `src/pages/EditarRegistroFinanceiro.tsx`
  - **Components**: `src/components/financial/` (FinancialHeader, FinancialSummaryCard, FinancialTransactionsList, etc.)
  - **Form Components**: `src/components/financial/form/` (FinancialRecordForm, etc.)
  - **Hooks**: `src/hooks/use-financial-data.ts`, `src/hooks/use-financial-record.ts`
  - **Utils**: `src/utils/financialUtils.ts`
  - **Services**: `src/services/financialService.ts`
- **Tipo**: Pages + Components + Hooks + Utils + Services

### Clientes
- **Descrição**: Cadastro e gerenciamento de clientes, visualização de histórico e anexos.
- **Implementação**:
  - **Pages**: `src/pages/Clients.tsx`, `src/pages/ClientForm.tsx`, `src/pages/ClientView.tsx`
  - **Components**: `src/components/client/` (ClientCard, ClientList, ClientHeader, etc.)
  - **Services**: `src/services/clientService.ts`
- **Tipo**: Pages + Components + Services

### Sistema de Filtros (Transversal)
- **Descrição**: Funcionalidades de filtragem em várias seções do sistema.
- **Implementação**:
  - **Financial Filters**: `src/components/financial/FinancialFilters.tsx`, `src/components/financial/filters/`
  - **Client Filter**: `src/components/financial/filters/ClientFilter.tsx`
  - **Period Filter**: `src/components/financial/filters/PeriodFilter.tsx`
  - **Category Filter**: `src/components/financial/filters/CategoryFilter.tsx`
  - **Agenda Status Filter**: `src/components/agenda/AgendaStatusFilter.tsx`
  - **Utils**: `src/utils/financialUtils.ts` (filterFinancialRecords)
- **Tipo**: Components + Utils

### Autenticação
- **Descrição**: Sistema de login, registro e controle de acesso.
- **Implementação**:
  - **Pages**: `src/pages/Login.tsx`, `src/pages/Register.tsx`
  - **Context**: `src/contexts/AuthContext.tsx`
  - **Service**: `src/services/authService.ts`
  - **Component**: `src/components/PrivateRoute.tsx`
- **Tipo**: Pages + Context + Service + Component

## 🧩 2. Arquitetura e Estrutura de Diretórios

### Estrutura Principal
```
src/
├── pages/            # Páginas principais da aplicação
├── components/       # Componentes reutilizáveis 
├── hooks/            # Hooks customizados
├── contexts/         # Contextos React
├── services/         # Serviços de dados e APIs
│   ├── store/        # Armazenamento de dados mock
├── utils/            # Funções utilitárias
├── lib/              # Bibliotecas e funções comuns
├── assets/           # Recursos estáticos
└── types/            # Definições de tipos TypeScript
```

### Detalhamento das Pastas

#### `/pages`
- Contém os componentes de nível superior que definem cada rota
- Geralmente são compostos por múltiplos componentes menores
- Responsáveis por carregar dados e orquestrar a interação entre componentes

#### `/components`
- Componentes reutilizáveis organizados por domínio funcional:
  - `/ui`: Componentes básicos de UI (buttons, cards, inputs, etc.)
  - `/dashboard`: Componentes específicos para o dashboard
  - `/agenda`: Componentes relacionados à agenda
  - `/financial`: Componentes para as funcionalidades financeiras
  - `/client`: Componentes para gerenciamento de clientes
  - `/appointment`: Componentes para visualização e edição de agendamentos

#### `/hooks`
- Custom hooks que encapsulam lógica reutilizável:
  - `use-financial-data.ts`: Gerencia dados financeiros e filtragem
  - `use-financial-record.ts`: Lida com operações CRUD em registros financeiros
  - `use-agenda.ts`: Gerencia dados da agenda
  - `use-appointment-status.ts`: Gerencia status de compromissos
  - `use-toast.ts`: Interface para o sistema de notificações
  - `use-mobile.ts`: Detecção de dispositivos móveis

#### `/services`
- Concentra toda a lógica de acesso a dados:
  - `mockData.ts`: Ponto central para exportação de serviços e tipos
  - Serviços específicos por domínio (clientService, financialService, etc.)
  - `/store`: Armazena dados mock para simulação de backend
  - `/appointments`: Lógica específica para compromissos

#### `/utils`
- Funções utilitárias para processamento específico:
  - `financialUtils.ts`: Funções para processamento de dados financeiros
  - Outras funções auxiliares para domínios específicos

#### `/contexts`
- Contextos React para gerenciamento de estado global:
  - `AuthContext.tsx`: Gerenciamento de autenticação

## 🔗 3. Fluxo de Dependência e Reaproveitamento

### Fluxo de Dados Principal
1. **Pages** requisitam dados através de **Hooks** ou diretamente dos **Services**
2. **Services** acessam os dados da **Store** (mock data) ou APIs externas
3. **Components** recebem dados via props e gerenciam estado local quando necessário
4. **Utils** fornecem funções auxiliares para processamento e transformação de dados

### Componentes Reutilizáveis

#### Componentes UI Básicos
- `src/components/ui/` - Todos os componentes básicos (button, card, input, etc.)
- Utilizados extensivamente em toda a aplicação

#### Componentes de Domínio Específico Reutilizados
- **Financial Form Components**:
  - `src/components/financial/form/` - Decomposição do formulário financeiro em componentes menores
  - Utilizados em `NovoRegistroFinanceiro.tsx` e `EditarRegistroFinanceiro.tsx`

- **Client Components**:
  - `src/components/client/` - Usados em múltiplas páginas relacionadas a clientes

- **Appointment Components**:
  - `src/components/appointment/` - Usados nas telas de agenda e visualização de compromissos

### Centralização de Lógica

#### Gerenciamento de Estado
- **Custom Hooks**:
  - `use-financial-data.ts` - Centraliza lógica de dados financeiros
  - `use-financial-record.ts` - Gerencia operações em registros financeiros
  - `use-agenda.ts` - Centraliza lógica da agenda

- **Contexto de Autenticação**:
  - `AuthContext.tsx` - Gerencia estado global de autenticação

#### Serviços e Store
- `mockDataService` - Ponto centralizado de acesso a dados
- `/services/store/` - Armazenamento de dados mock separado por domínio

### Pontos de Acoplamento
1. **Alta Dependência do mockDataService**:
   - Múltiplos componentes e hooks dependem diretamente deste serviço

2. **Componentes de Formulário Financeiro**:
   - Forte acoplamento entre os componentes de formulário financeiro

3. **Dependência Direta de Serviços**:
   - Alguns componentes chamam serviços diretamente em vez de receber dados via props

## 🚀 4. Análise e Sugestões de Melhorias

### Refatorações Sugeridas

1. **Padronização de Hooks para Acesso a Dados**:
   - Criar hooks padronizados para todas as operações CRUD, seguindo o modelo de `use-financial-record.ts`
   - Ex: `use-client.ts`, `use-appointment-type.ts`, etc.

2. **Redução de Arquivos Longos**:
   - Continuar o processo de refatoração de arquivos extensos, como já iniciado com `Financeiro.tsx` e `NovoRegistroFinanceiro.tsx`

3. **Abstração de Acesso a Dados**:
   - Criar uma camada de abstração entre os hooks e os serviços para facilitar futura integração com APIs reais
   - Implementar padrão Repository ou Data Access Layer

4. **Normalização da Estrutura de FormData**:
   - Padronizar a estrutura e nomenclatura de objetos de formulário entre diferentes funcionalidades

### Melhorias Arquiteturais

1. **Gerenciamento de Estado Global**:
   - Implementar solução consistente de gerenciamento de estado (Context API ou outra biblioteca)
   - Mover estado dos hooks para stores globais quando apropriado

2. **Estrutura de Serviços**:
   - Padronizar interfaces de serviços para facilitar eventual substituição do mock por APIs reais
   - Separação mais clara entre camada de acesso a dados e regras de negócio

3. **Sistema de Roteamento**:
   - Centralizar definição de rotas e parâmetros
   - Implementar guarda-rotas mais sofisticados para permissões específicas

### Melhorias Funcionais

1. **Dashboard**:
   - Adicionar mais visualizações gráficas de dados financeiros
   - Implementar KPIs personalizáveis

2. **Financeiro**:
   - Adicionar relatórios customizáveis
   - Implementar exportação de dados (CSV, PDF)
   - Categorias personalizáveis para receitas/despesas

3. **Clientes**:
   - Melhorar sistema de histórico de interações
   - Adicionar sistema de tags/categorização 
   - Implementar notas de sessão estruturadas

4. **Agenda**:
   - Adicionar sistema de lembretes/notificações
   - Implementar recorrência de compromissos
   - Melhorar visualização de compromissos conflitantes

### Sugestões UX/UI

1. **Consistência Visual**:
   - Padronizar tamanhos, espaçamentos e comportamentos de componentes similares
   - Criar um Design System documentado

2. **Acessibilidade**:
   - Melhorar suporte para leitores de tela
   - Adicionar navegação por teclado
   - Implementar temas de alto contraste

3. **Experiência Mobile**:
   - Otimizar visualização da agenda em telas pequenas
   - Melhorar navegação em formulários extensos

4. **Formulários**:
   - Implementar validação em tempo real
   - Adicionar autosave para evitar perda de dados
   - Melhorar feedback visual de erros

### Pontos de Atenção Técnicos

1. **Duplicação de Lógica**:
   - Lógica de filtragem duplicada em diferentes partes do sistema
   - Processamento de datas repetido em vários componentes

2. **Acoplamento**:
   - Alta dependência direta de serviços em componentes
   - Componentes que assumem estruturas específicas de dados

3. **Componentes Grandes**:
   - Alguns componentes ainda têm responsabilidade excessiva
   - Por exemplo, formulários complexos poderiam ser mais decompostos
   
4. **TypeScript**:
   - Melhorar tipagem em alguns lugares onde `any` é usado
   - Criar interfaces mais específicas para props de componentes
