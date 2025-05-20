Avaliação de Prontidão para Migração para Supabase
1. Diagnóstico Técnico do Acoplamento Atual com Dados Mockados
1.1 Estado atual da arquitetura
O projeto está em um estágio de transição entre duas arquiteturas:

Arquitetura Legada - Serviços mockados diretamente acoplados aos componentes:

A maioria dos componentes em /components/agenda, /components/appointment e alguns em /pages ainda importam diretamente de mockDataService
O fluxo de autenticação (AuthContext.tsx) ainda depende de mockAuthService
Tipagem das entidades ainda é centralizada em src/services/types.ts
Nova Arquitetura - Padrão Repository com interfaces bem definidas:

Implementação base em BaseRepository com métodos padrão CRUD
Implementações especializadas para cada entidade (Financial, Client, Appointment)
Hooks customizados (useClientRepository, useFinancialRepository) para acesso a dados
1.2 Pontos de acoplamento críticos
Importações diretas de mockDataService:

Vários componentes como AppointmentViewDataLoader.tsx e DashboardDataLoader.tsx
Páginas como Agenda.tsx, AppointmentTypes.tsx, ClientView.tsx
Uso do getCurrentUserId():

Função que lê o usuário do localStorage sem abstração adequada
Utilizada em vários lugares como fallback para identificação do usuário
Estruturas de dados hardcoded:

Lojas de dados mockados como financialRecordsByUser, appointmentsByUser
Valores default para novas entidades definidos diretamente no código
2. Pontos Positivos para Migração
2.1 Arquitetura preparada para persistência real
✅ Uso do Padrão Repository:

Interface claramente definida em types/repository.ts
Implementações base em BaseRepository com métodos CRUD genéricos
Extensões específicas por domínio (FinancialRepository, AppointmentRepository)
Métodos assíncronos já preparados para operações de rede reais
✅ Separação de responsabilidades:

Formulários compostos em componentes separados e reutilizáveis
Hooks com responsabilidades únicas e bem definidas
Validação centralizada via Zod em utils/validation.ts
✅ Forte tipagem com TypeScript:

Interfaces para todas as entidades principais
Schemas Zod para validação de dados de formulários
Tipagem de retornos de API claramente definida
✅ Componentização modular:

Componentes decompostos com responsabilidades únicas
Estruturação por domínio funcional
UI separada da lógica de negócios
2.2 Abstração de serviços de dados
✅ Hooks customizados para acesso a dados:

Encapsulam operações CRUD e gerenciamento de estado
Tratamento de erros centralizado
Validação integrada antes de operações de persistência
✅ Interfaces para operações específicas por domínio:

FinancialRepository com métodos como getByPeriod e getSummary
AppointmentRepository com métodos como getByDateRange e getByStatus
ClientRepository com métodos como search
3. Pontos de Ajuste Necessários
3.1 Eliminação de acoplamento remanescente
⚠️ Componentes que ainda usam mockDataService:

Necessidade de migração completa para o padrão Repository
Remover importações diretas do mockDataService
Revisão dos componentes que ainda não usam os hooks de repositório
⚠️ Autenticação acoplada à implementação mock:

AuthContext ainda depende diretamente de mockAuthService
Necessidade de abstrair interface de autenticação
3.2 Gerenciamento de Estado e Cache
⚠️ Lógica de refresh e atualização de estado inconsistente:

Alguns componentes chamam refresh após operações, outros não
Falta mecanismo centralizado de invalidação de cache
Ausência de estratégia para lidar com concorrência e atualizações parciais
⚠️ Estado local vs. Estado global:

Mistura de abordagens (hooks locais e compartilhamento via props)
Falta de solução para compartilhamento de estado entre rotas
3.3 Tratamento de Erros e Conexão de Rede
⚠️ Tratamento de erros inconsistente:

Alguns componentes têm try/catch robusto, outros mais simplificados
Faltam estratégias para retry, timeout, ou erros de conexão específicos
Mensagens de erro genéricas em alguns lugares
⚠️ Ausência de gestão de estado offline/online:

Não existe estratégia para operações offline
Falta fila de operações para sincronização posterior
4. Sugestões para Preparação para Supabase
4.1 Autenticação e Controle de Acesso
🔄 Implementar camada de abstração para autenticação:

Criar interface AuthProvider com métodos padronizados
Implementar versão Supabase dessa interface
Integrar com Auth Context existente
Mapear usuários do Supabase para o modelo atual
🔄 Definir estratégia de Row-Level Security (RLS):

Adicionar Claims JWT para identificação do usuário
Definir políticas RLS para cada tabela baseadas no userId
Garantir que operações CRUD respeitem essas políticas
4.2 Migração de Dados e Esquema
🔄 Definição de esquema Supabase:

Mapear interfaces TypeScript para tabelas PostgreSQL
Criar migrações para estrutura inicial
Definir relacionamentos e constraints
Implementar índices para consultas frequentes
🔄 Estratégia de migração de dados:

Script para exportar dados mockados
Importação para Supabase preservando IDs e relações
Verificação de integridade pós-migração
4.3 Implementação de Repositórios Supabase
🔄 Criar implementações Supabase dos repositórios:

Implementar SupabaseBaseRepository estendendo BaseRepository
Sobrescrever métodos CRUD para usar o SDK do Supabase
Implementar métodos específicos para cada domínio
Garantir tipagem correta dos retornos
🔄 Otimizações para performance:

Implementar select otimizado com colunas específicas
Usar RPC para operações complexas
Implementar estratégia de paginação
Adicionar cache local para dados frequentemente acessados
4.4 Refatoração dos Hooks e Componentes
🔄 Completar migração para hooks de repositório:

Identificar todos os componentes que ainda usam mockDataService
Substituir por hooks de repositório apropriados
Refatorar componentes para usar react-query para gerenciamento de estado
🔄 Implementar React Query/TanStack Query:

Criar hooks de query personalizados para cada endpoint
Implementar política de cache e invalidação
Adicionar gerenciamento otimista de UI
Implementar tratamento de erro mais sofisticado
5. Estrutura Mínima Recomendada no Supabase
5.1 Tabelas Core
users

Colunas: id, name, email, password_hash, profession, work_hours, cancel_policy, whatsapp_number, default_message, plan
RLS: Acesso apenas ao próprio registro
clients

Colunas: id, user_id, name, phone, email, notes, birthdate, feedback_status
RLS: Acesso apenas a registros onde user_id = auth.uid()
appointments

Colunas: id, user_id, client_id, type, date, time, duration, location, status, notes
RLS: Acesso apenas a registros onde user_id = auth.uid()
financial_records

Colunas: id, user_id, amount, description, date, type, category, related_appointment, client_id, notes
RLS: Acesso apenas a registros onde user_id = auth.uid()
appointment_types

Colunas: id, user_id, name, description
RLS: Acesso apenas a registros onde user_id = auth.uid()
attachments

Colunas: id, user_id, client_id, name, type, size, url, appointment_id, notes, date_uploaded
RLS: Acesso apenas a registros onde user_id = auth.uid()
Integração com Storage para os arquivos
5.2 Funções e Triggers
on_appointment_create

Trigger que atualiza estatísticas do usuário
calculate_monthly_summary

Função RPC para cálculos financeiros agregados
get_appointments_by_period

Função otimizada para buscar agendamentos por período
5.3 Storage Buckets
attachments
Para armazenamento de arquivos relacionados a clientes
RLS: Acesso apenas a arquivos onde metadata.user_id = auth.uid()
6. Conclusão
O sistema já possui uma boa base arquitetural para migração para o Supabase, com o padrão Repository implementado e uma separação clara de responsabilidades. No entanto, ainda existem componentes que precisam ser migrados para o novo padrão e lacunas a serem preenchidas na gestão de estado e tratamento de erros.

A estratégia recomendada seria:

Concluir a migração para o padrão Repository em todos os componentes
Implementar adaptadores Supabase para os repositórios existentes
Adicionar TanStack Query para gerenciamento de estado e cache
Migrar gradualmente, começando por uma funcionalidade (ex: Financeiro)
Implementar autenticação via Supabase
Migrar as demais funcionalidades
Com essas alterações, o sistema estará pronto para operar com um backend real, mantendo a mesma API que os componentes já esperam, minimizando as alterações necessárias na camada de UI.

Plano de Migração para Supabase
Fase 1: Preparação da Arquitetura
Concluir migração de componentes legados para o padrão Repository
Implementar abstração de autenticação
Adicionar TanStack Query para gerenciamento de estado e cache
Fase 2: Implementação do Backend Supabase
Criar estrutura de tabelas e políticas RLS
Implementar Storage para anexos
Configurar autenticação e funções RPC
Fase 3: Adaptação dos Repositórios
Criar implementações Supabase dos repositórios existentes
Implementar estratégias de cache e paginação
Adicionar tratamento de erros específico para API
Fase 4: Migração Gradual por Módulo
Módulo Financeiro (Menor acoplamento, mais preparado)
Módulo de Clientes
Módulo de Agenda/Compromissos
Autenticação e Perfil de Usuário
Fase 5: Refinamento e Otimização
Implementar funcionalidades offline
Otimizar queries e minimizar requisições
Adicionar monitoramento de performance
