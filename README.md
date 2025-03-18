# bidding
sistema de capitalização de licitações

Desenvoolvido em PHP / Laravel | JavaScript / Vue.js | Docker | Banco SQL

Bidding é um sistema de capitalização de licitações desenvolvido utilizando as seguintes tecnologias:

Backend: PHP com o framework Laravel.

Frontend: JavaScript com o framework Vue.js.

Infraestrutura: Docker para conteinerização e portabilidade.

Em essência, a aplicação visa facilitar e organizar o processo de licitações, provavelmente permitindo o gerenciamento de propostas, acompanhamento de prazos, controle financeiro e comunicação entre os envolvidos. O nome "sistema de capitalização de licitações" pode sugerir funcionalidades como:

Registro e organização de licitações: Armazenar informações relevantes de cada licitação, como edital, prazos, requisitos, etc.

Cálculo e simulação de propostas: Ferramentas para auxiliar na elaboração de propostas competitivas, considerando custos, margem de lucro e outros fatores.

Acompanhamento e análise de resultados: Monitorar o desempenho das licitações, identificando oportunidades de melhoria e otimização.

Geração de relatórios: Produzir relatórios detalhados sobre o andamento das licitações, auxiliando na tomada de decisões estratégicas.

A utilização de PHP/Laravel no backend garante um desenvolvimento ágil e escalável, enquanto o Vue.js no frontend proporciona uma interface moderna e responsiva. O Docker facilita a implantação e a manutenção da aplicação em diferentes ambientes.



#1. Estratégias de desenvolvimento, arquitetura e justificativa das tecnologias
Estratégia de Desenvolvimento

Desenvolvimento Ágil: Metodologia Scrum com sprints semanais para iterações mais rápidas e feedback constante.
MVP Priorizado: Foco nas funcionalidades essenciais primeiro, com incrementos planejados para versões posteriores.
Desenvolvimento Orientado a Testes (TDD): Implementação de testes automatizados para funções críticas, garantindo estabilidade.
Integração Contínua: Implementação simplificada de CI para garantir qualidade do código sem comprometer o prazo.

Arquitetura

Monolítica Modular: Mantemos a escolha pela arquitetura monolítica por:

Maior velocidade de desenvolvimento inicial
Redução da complexidade operacional
Módulos internos bem definidos que permitem evolução futura
Performance otimizada para operações transacionais entre domínios



Justificativa das Tecnologias

PHP/Laravel (Backend):

Produtividade acelerada com scaffolding e geradores de código
APIs RESTful facilmente implementáveis
Eloquent ORM para abstração de banco de dados
Ecossistema de pacotes que aceleram o desenvolvimento


JavaScript/Vue.js (Frontend):

Componentes reutilizáveis reduzindo tempo de desenvolvimento
Vue CLI para setup rápido e otimizado
Integração simplificada com APIs
Biblioteca de componentes Vuetify para acelerar desenvolvimento da UI


Docker:

Setup rápido com imagens pré-configuradas
Ambiente consistente entre todos os desenvolvedores
Simplificação do processo de deployment



#2. Plano de Trabalho (3 meses)
Semana 1: Planejamento e Setup

Definição detalhada do escopo do MVP
Configuração do ambiente de desenvolvimento com Docker
Setup do repositório e fluxo de trabalho Git
Modelagem inicial do banco de dados
Prototipação das telas principais

Semanas 2-3: Fundação do Sistema

Implementação da autenticação e controle de acesso
Estrutura básica do frontend com layouts e componentes core
Criação das migrações e modelos de dados principais
Desenvolvimento das APIs básicas

Semanas 4-6: Módulo de Gerenciamento de Licitações

Cadastro e edição de licitações
Visualização e filtros de busca
Controle de prazos e notificações básicas
Upload e gerenciamento de documentos

Semanas 7-8: Motor de Cálculo e Propostas

Implementação do motor de cálculo para propostas
Simuladores de valores e margem
Comparativo entre propostas
Geração de relatórios essenciais

Semanas 9-10: Dashboard e Análises

Dashboard principal com KPIs
Gráficos de desempenho e sucesso em licitações
Alertas de oportunidades
Exportação de dados

Semana 11: Testes e Refinamentos

Testes integrados do sistema
Ajustes de UX baseados em feedback
Otimizações de performance
Correção de bugs identificados

Semana 12: Finalização e Lançamento

Documentação essencial do sistema
Treinamento básico para usuários
Deploy para ambiente de produção
Suporte inicial pós-lançamento

Recursos Necessários

Serviços: Hospedagem em nuvem, repositório Git, ferramentas de controle de projeto
Hardware: Estações de trabalho adequadas para desenvolvimento

# Requisitos Funcionias

Gestão de Usuários e Perfis

Cadastro e autenticação de usuários
Diferentes níveis de acesso (administrador, gestor, analista, visualizador)
Gerenciamento de permissões por módulo


Cadastro e Gestão de Licitações

Registro de editais com campos estruturados
Upload e gerenciamento de documentos relacionados
Classificação e categorização de licitações
Registro de requisitos específicos da licitação
Envio de email com as principais licitações abertas
Busca por licitações no site


Cronograma e Controle de Prazos

Calendário de licitações com datas importantes
Sistema de lembretes e alertas automáticos
Visualização de linha do tempo da licitação

Acompanhamento de Processos

Registro de status da licitação (em análise, proposta enviada, ganho, perdido)
Histórico de comunicações e ações tomadas
Registro de motivos de desclassificação ou perda

Dashboard Analítico

Visão geral de licitações ativas e seu status
Métricas de desempenho e taxa de sucesso
Gráficos de distribuição por órgão, valor e categoria

Geração de Relatórios

Relatórios de performance e participação
Exportação de dados em formatos diversos (PDF, Excel)
Relatórios comparativos entre períodos


Notificações e Alertas

Notificações por e-mail/sistema sobre prazos críticos
Alertas sobre novas oportunidades de licitação
Notificações de alterações em editais

# Requisitos Não Funcionais

Desempenho

Tempo de resposta inferior a 2 segundos para operações regulares
Capacidade para processar simultaneamente múltiplas simulações
Suporte a pelo menos 50 usuários simultâneos


Segurança

Criptografia de dados sensíveis
Autenticação segura com opção de dois fatores
Registro de logs de acesso e alterações (auditoria)
Proteção contra injeção SQL e ataques comuns


Usabilidade

Interface responsiva para acesso via desktop e dispositivos móveis
Design intuitivo com fluxos de trabalho otimizados
Guias contextuais de ajuda e tooltips


Disponibilidade

Disponibilidade mínima de 99,5% em horário comercial
Plano de contingência para falhas
Backups automáticos diários


Escalabilidade

Arquitetura que permita crescimento do número de usuários
Capacidade de expansão para novos módulos
Otimização para aumento de volume de dados


Manutenibilidade

Código documentado seguindo padrões
Estrutura modular facilitando manutenção
Ambiente de teste separado


Interoperabilidade

APIs RESTful para possíveis integrações
Suporte a importação/exportação de dados em formatos padrão
Capacidade de integração com sistemas de e-mail e calendário


Conformidade

Adequação à LGPD para tratamento de dados pessoais
Registro de consentimento de usuários
Atendimento a requisitos legais específicos de licitações

