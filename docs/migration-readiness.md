# 📦 Avaliação de Prontidão para Migração para Supabase

## 1. Diagnóstico Técnico do Acoplamento Atual com Dados Mockados

### 1.1 Estado atual da arquitetura

- **Arquitetura Legada**:
  - Componentes ainda importam diretamente de `mockDataService`
  - `AuthContext.tsx` depende de `mockAuthService`
  - Tipos centralizados em `src/services/types.ts`
- **Nova Arquitetura**:
  - Padrão Repository com `BaseRepository`
  - Hooks padronizados para CRUD por entidade
  - Tipagem e validação já preparadas para rede

### 1.2 Pontos de acoplamento críticos

- Importações diretas de `mockDataService` em diversos componentes
- Uso de `getCurrentUserId()` acoplado ao `localStorage`
- Estruturas mockadas como `appointmentsByUser`

## 2. Pontos Positivos para Migração

### 2.1 Arquitetura preparada para persistência real

- ✅ Uso do Padrão Repository com interfaces e hooks bem definidos
- ✅ Separação de responsabilidades (formulários, hooks, validação com Zod)
- ✅ Tipagem forte com TypeScript
- ✅ Componentização modular por domínio funcional

### 2.2 Abstração de serviços de dados

- Hooks encapsulam operações e tratamento de erro
- Interfaces específicas por domínio (ex: `getByPeriod`, `getByStatus`)

## 3. Pontos de Ajuste Necessários

### 3.1 Eliminação de acoplamento remanescente

- Componentes ainda usando `mockDataService`
- Autenticação acoplada ao mock

### 3.2 Gerenciamento de Estado e Cache

- Refresh inconsistente
- Ausência de estratégia de cache e concorrência

### 3.3 Tratamento de Erros e Rede

- Tratamento inconsistente
- Sem retry/timeout
- Falta de lógica offline

## 4. Sugestões para Preparação para Supabase

### 4.1 Autenticação e RLS

- Criar interface `AuthProvider`
- Adicionar Claims JWT e configurar RLS por userId

### 4.2 Migração de Dados

- Mapear tipos para tabelas
- Criar migrações e importar dados mock

### 4.3 Repositórios Supabase

- Criar `SupabaseBaseRepository`
- Implementar repositórios por entidade usando SDK Supabase
- Adicionar cache, paginação e otimizações

### 4.4 Refatoração de Hooks

- Migrar componentes para hooks de repositório
- Integrar React Query/TanStack Query para gerenciamento de estado

## 5. Estrutura Mínima Recomendada no Supabase

### 5.1 Tabelas

- `users`, `clients`, `appointments`, `financial_records`, `appointment_types`, `attachments`
- RLS baseada em `auth.uid()`

### 5.2 Funções e Triggers

- `on_appointment_create`, `calculate_monthly_summary`, `get_appointments_by_period`

### 5.3 Storage Buckets

- Bucket: `attachments` com RLS por `metadata.user_id`

## 6. Conclusão e Plano de Migração por Fases

### Fase 1: Preparação

- Finalizar padrão repository
- Implementar autenticação e React Query

### Fase 2: Backend Supabase

- Criar tabelas, policies e autenticação

### Fase 3: Adaptação

- Repositórios Supabase e cache

### Fase 4: Migração gradual

- Começar por módulo Financeiro → Clientes → Agenda → Auth

### Fase 5: Otimizações

- Offline, performance e monitoramento
