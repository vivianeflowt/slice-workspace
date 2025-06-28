markdown
 TASKSmd  Pacote ERD
Lista de tarefas granulares para desenvolvimento do organizador automático de documentação
 1 Estruturação do Projeto
   Inicializar projeto TypeScript com estrutura básica
   Configurar Makefile e scripts de buildtestclean
   Criar arquivo central de configuração configts ou configjson
   Definir estrutura de diretórios src cli utils logs etc
 2 Integração com Engines de IA
   Implementar módulo de requisições HTTP axios
   Mapear endpoints dos modelos disponíveis no servidor
   Permitir fácil troca de modeloparâmetroprompt
   Preparar integração plugável para novas engines
 3 Lógica de Organização e Sumarização
   Função para dividir arquivos grandes em blocos lógicos
   Função para agrupar blocos por contextosemelhança
   Função para detectar e sinalizar contradiçõesrevisões
   Função para sugerir definiçãocorreção final de cada tópico
   Função para gerar arquivo final organizado
 4 CLI e Usabilidade
   Implementar CLI com commander
   Adicionar prompts interativos com inquirer opcional
   Permitir rodar comandos para organizar arquivo inteiro ou só um trecho
   Gerar logs detalhados de cada execução
 5 Testes e Validação
   Criar scripts de teste automatizado usando exemplos reais EXEMPLOmd
   Validar idempotência rodar múltiplas vezes não piora o arquivo
   Registrar experimentos e resultados em arquivos próprios
 6 Documentação e Experimentos
   Manter PROJECTmd sempre atualizado com decisões e aprendizados
   Documentar cada experimento prompt modelo parâmetros resultado
   Criar READMEmd detalhado para onboarding
 Refinar detalhar e priorizar tarefas conforme o andamento do projeto e feedback do usuário