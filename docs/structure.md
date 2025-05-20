
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
  - **Pages**: `src/pages/Agenda.tsx`, `src/pages/AppointmentView.tsx`, `src/pages/NovoAgendamento.tsx`
  - **Components**: 
    - **Visualizações**: `src/components/agenda/` (AgendaDayView, AgendaWeekView, AgendaMonthView, AgendaHeader)
    - **Day View**: `src/components/agenda/day-view/` (AppointmentCard, AppointmentDetails, AppointmentActions)
    - **Appointment**: `src/components/appointment/` (AppointmentForm, AppointmentDetails, StatusSelector)
  - **Hooks**: 
    - `src/hooks/use-agenda.ts` - Gerenciamento principal da agenda
    - `src/hooks/use-appointment-status.ts` - Controle de status dos compromissos
    - `src/hooks/use-appointment-repository.ts` - Acesso ao repositório de compromissos
  - **Repository**: `src/repositories/appointmentRepository.ts` - Implementação do padrão Repository
  - **Services**: `src/services/appointments/` (getAppointments, modifyAppointments, executeAppointment)
- **Tipo**: Pages + Components + Hooks + Repository + Services

### Financeiro
- **Descrição**: Gerenciamento financeiro, incluindo receitas, despesas, análise e registro de transações.
- **Implementação**:
  - **Pages**: 
    - `src/pages/Financeiro.tsx` - Visão geral dos registros financeiros
    - `src/pages/FinancialView.tsx` - Detalhes de um registro específico
    - `src/pages/NovoRegistroFinanceiro.tsx` - Criação de novos registros
    - `src/pages/EditarRegistroFinanceiro.tsx` - Edição de registros existentes
  - **Components**: 
    - **Principal**: `src/components/financial/` (FinancialHeader, FinancialSummaryCard, FinancialTransactionsList)
    - **Filtros**: `src/components/financial/filters/` (ClientFilter, CategoryFilter, PeriodFilter)
    - **Formulário**: `src/components/financial/form/` (FinancialForm, campos decompostos)
    - **Visualização**: `src/components/financial/view/` (FinancialViewHeader, FinancialRecordDetails)
    - **Record**: `src/components/financial/record/` (FinancialRecordPage - componente unificado de formulário)
  - **Hooks**: 
    - **Dados**: `src/hooks/financial/` (index.ts exporta todos)
      - `use-financial-data.ts` - Hook principal que compõe outros hooks
      - `use-financial-records.ts` - Busca e gerenciamento de registros
      - `use-financial-filters.ts` - Aplicação de filtros
      - `use-financial-filters-state.ts` - Estado dos filtros
    - **Formulário**: 
      - `use-financial-form.tsx` - Hook principal de formulário
      - `use-financial-form-state.ts` - Gerenciamento do estado do formulário
      - `use-financial-form-handlers.ts` - Manipuladores de eventos
      - `use-financial-form-submission.ts` - Submissão do formulário
      - `use-financial-validation.ts` - Validação de dados
    - **Outros**: `use-financial-record.ts`, `use-financial-view.ts`, `use-financial-repository.ts`
  - **Repository**: `src/repositories/financialRepository.ts` - Implementação do padrão Repository
  - **Utils**: `src/utils/financialUtils.ts` - Funções utilitárias para filtros e formatação
- **Tipo**: Pages + Components + Hooks + Repository + Utils

### Clientes
- **Descrição**: Cadastro e gerenciamento de clientes, visualização de histórico e anexos.
- **Implementação**:
  - **Pages**: `src/pages/Clients.tsx`, `src/pages/ClientForm.tsx`, `src/pages/ClientView.tsx`
  - **Components**: 
    - **Lista**: `src/components/client/` (ClientCard, ClientList, ClientHeader, etc.)
    - **Formulário**: `src/components/client/form/` (ClientFormFields, ClientFormActions, etc.)
    - **Anexos**: `src/components/client/attachment/` (AttachmentList, AttachmentCard, etc.)
  - **Hooks**: `src/hooks/use-client-repository.ts` - Acesso ao repositório de clientes
  - **Repository**: `src/repositories/clientRepository.ts` - Implementação do padrão Repository
  - **Services**: `src/services/clientService.ts` - Serviços legados
- **Tipo**: Pages + Components + Hooks + Repository + Services

### Sistema de Filtros (Transversal)
- **Descrição**: Funcionalidades de filtragem em várias seções do sistema.
- **Implementação**:
  - **Financial Filters**: 
    - **Component**: `src/components/financial/FinancialFilters.tsx`
    - **Subcomponents**: `src/components/financial/filters/` (ClientFilter, PeriodFilter, CategoryFilter)
    - **Hooks**: `src/hooks/financial/use-financial-filters.ts`, `use-financial-filters-state.ts`
  - **Agenda Status Filter**: `src/components/agenda/AgendaStatusFilter.tsx`
  - **Utils**: `src/utils/financialUtils.ts` (filterFinancialRecords)
- **Tipo**: Components + Hooks + Utils

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
│   ├── financial/    # Hooks específicos para funcionalidades financeiras
├── contexts/         # Contextos React para estado global
├── services/         # Serviços de dados e APIs
│   ├── store/        # Armazenamento de dados mock
├── repositories/     # Implementações do padrão Repository
├── utils/            # Funções utilitárias
├── lib/              # Bibliotecas e funções comuns
├── assets/           # Recursos estáticos
├── types/            # Definições de tipos TypeScript
│   ├── forms.ts      # Tipos para formulários
│   ├── repository.ts # Interfaces para repositórios
```

### Detalhamento das Pastas

#### `/pages`
- Componentes de nível superior que definem cada rota
- Usam hooks, componentes e serviços para compor a funcionalidade
- Responsáveis por orquestrar a interação entre componentes

#### `/components`
- Componentes reutilizáveis organizados por domínio funcional:
  - `/ui`: Componentes básicos de UI do shadcn/ui (buttons, cards, inputs, etc.)
  - `/dashboard`: Componentes específicos para o dashboard
  - `/agenda`: Componentes relacionados à agenda
  - `/financial`: Componentes para as funcionalidades financeiras
    - `/form`: Formulários decompostos com campos individuais
    - `/filters`: Componentes de filtro
    - `/view`: Componentes para visualização de registros
    - `/record`: Componentes para edição e criação de registros
  - `/client`: Componentes para gerenciamento de clientes
    - `/form`: Formulários para clientes
    - `/attachment`: Componentes para anexos
  - `/appointment`: Componentes para visualização e edição de agendamentos

#### `/hooks`
- Custom hooks que encapsulam lógica reutilizável:
  - `/financial`: Conjunto de hooks para funcionalidades financeiras:
    - `use-financial-data.ts`: Compõe outros hooks menores
    - `use-financial-records.ts`: Busca registros financeiros
    - `use-financial-filters.ts`: Aplica filtros aos registros
    - `use-financial-filters-state.ts`: Gerencia estado dos filtros
    - `use-financial-form.tsx`: Hook principal para formulários
    - `use-financial-form-state.ts`: Estado do formulário
    - `use-financial-form-handlers.ts`: Event handlers para formulário
    - `use-financial-form-submission.ts`: Submissão do formulário
    - `use-financial-validation.ts`: Validação de dados
  - Hooks para repositórios:
    - `use-financial-repository.ts`: Hook para repositório financeiro
    - `use-client-repository.ts`: Hook para repositório de clientes
    - `use-appointment-repository.ts`: Hook para repositório de agendamentos
  - Outros hooks:
    - `use-toast.ts`: Interface para o sistema de notificações
    - `use-mobile.ts`: Detecção de dispositivos móveis

#### `/services`
- Concentra toda a lógica de acesso a dados legada:
  - `mockData.ts`: Ponto central para exportação de serviços e tipos
  - Serviços específicos por domínio (clientService, financialService, etc.)
  - `/store`: Armazena dados mock para simulação de backend
  - `/appointments`: Lógica específica para compromissos

#### `/repositories`
- Implementações do padrão Repository:
  - `financialRepository.ts`: Repositório para dados financeiros
  - `clientRepository.ts`: Repositório para clientes
  - `appointmentRepository.ts`: Repositório para compromissos

#### `/utils`
- Funções utilitárias para processamento específico:
  - `financialUtils.ts`: Funções para processamento de dados financeiros
  - Outras funções auxiliares para domínios específicos

#### `/contexts`
- Contextos React para gerenciamento de estado global:
  - `AuthContext.tsx`: Gerenciamento de autenticação

#### `/lib`
- Código de infraestrutura e utilitários base:
  - `repository.ts`: Implementação base do padrão Repository
  - `utils.ts`: Funções utilitárias genéricas

#### `/types`
- Tipos TypeScript para toda a aplicação:
  - `forms.ts`: Tipos para formulários
  - `repository.ts`: Interfaces para o padrão Repository
  - `user.ts`: Tipos relacionados a usuários

## 🔗 3. Padrões Arquiteturais Adotados

### Repository Pattern
- **Objetivo**: Isolar acesso a dados e permitir substituição futura por APIs reais
- **Implementação**:
  - Base abstrata em `src/lib/repository.ts`
  - Implementações específicas em `src/repositories/`
  - Interfaces em `src/types/repository.ts`
  - Hooks de acesso em `src/hooks/use-*-repository.ts`
- **Benefícios**:
  - Desacoplamento entre acesso a dados e lógica de negócio
  - Facilidade para migração futura para APIs reais
  - Interface consistente para operações CRUD

### Decomposição de Formulários
- **Objetivo**: Reduzir complexidade e permitir reuso de componentes
- **Implementação**:
  - Componentes individuais para cada campo (`src/components/financial/form/`)
  - Hooks de formulário separados por responsabilidade (`src/hooks/financial/`)
- **Benefícios**:
  - Código mais manutenível e testável
  - Possibilidade de reusar campos entre diferentes formulários
  - Melhor separação de responsabilidades

### Composição de Hooks
- **Objetivo**: Separar responsabilidades e facilitar reuso
- **Implementação**:
  - Hooks pequenos e focados que são compostos por hooks de nível superior
  - Exemplo: `use-financial-data.ts` usa `use-financial-records.ts`, `use-financial-filters.ts`, etc.
- **Benefícios**:
  - Melhor testabilidade de cada hook individual
  - Reuso de lógica entre componentes
  - Separação clara de responsabilidades

### Decomposição de Componentes
- **Objetivo**: Reduzir complexidade e facilitar manutenção
- **Implementação**:
  - Componentes menores e focados (ex: `FinancialViewHeader`, `FinancialRecordDetails`)
  - Organização por domínio e funcionalidade
- **Benefícios**:
  - Melhor legibilidade e manutenibilidade
  - Facilidade para testar componentes isoladamente
  - Menor acoplamento entre partes do sistema

## 🚀 4. Análise e Sugestões de Melhorias

### Refatorações Sugeridas

1. **Migração Completa para o Padrão Repository**:
   - Continuar a migração de serviços diretamente acoplados para o padrão Repository
   - Eliminar referências diretas a `mockDataService` substituindo por hooks de repositório

2. **Padronização de Nomenclatura**:
   - Padronizar prefixos e sufixos (ex: todos os hooks com prefixo `use-` ou `use`)
   - Padronizar idioma (decidir entre português ou inglês para nomes de arquivos)

3. **Expansão da Decomposição de Formulários**:
   - Aplicar o padrão de decomposição de formulários para outras áreas como Clientes e Agendamentos

4. **Gerenciamento de Estado Global**:
   - Considerar uso mais extensivo de Context API ou implementação de stores globais

### Melhorias Arquiteturais

1. **Abstração de UI**:
   - Criar uma camada de abstração para componentes UI específicos do domínio
   - Implementar um Design System mais estruturado

2. **Melhor Separação de Domínios**:
   - Considerar uma organização por domínio em vez de por tipo de arquivo
   - Exemplo: `/financial/{components,hooks,services}` em vez de separar por tipo

3. **Padronização de Erros**:
   - Implementar um sistema padronizado de tratamento de erros
   - Centralizar mensagens de erro e estratégias de retry

4. **Testes Automatizados**:
   - Implementar testes unitários para hooks e componentes
   - Considerar testes de integração para fluxos completos

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

1. **Migração Gradual**:
   - Continuar a migração gradual do acesso direto a dados para o padrão Repository
   - Eliminar acoplamento direto com `mockDataService`

2. **Consistência de Tipagem**:
   - Melhorar tipagem em alguns lugares onde `any` é usado
   - Criar interfaces mais específicas para props de componentes

3. **Documentação de Código**:
   - Adicionar mais documentação em componentes e hooks complexos
   - Considerar ferramentas como JSDoc para documentação inline

4. **Monitoramento e Logging**:
   - Implementar sistema estruturado de logging
   - Considerar ferramentas de monitoramento para ambiente de produção
