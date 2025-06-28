
# Protocolo de Behaviors e SUB_SYSTEM_PROMPT

## Behaviors
- **GENERIC:** Modo padrão, sem contexto extra. Tudo é interpretado literalmente, sem sub prompt adicional.
- **PROJECT, FEEDBACK, CONTEXT, TASK, etc:** Sempre que um behavior diferente de GENERIC está ativo, o conteúdo do respectivo arquivo markdown é anexado como SUB_SYSTEM_PROMPT ao final de cada mensagem enviada pela usuária. Isso renova o contexto da IA a cada interação.

## Vantagens
- Garante alinhamento contínuo entre intenção da usuária e respostas da IA.
- Permite alternar rapidamente entre modos de operação, estilos e contextos.
- Facilita rastreabilidade, automação e evolução do fluxo de trabalho.

## Exemplo de fluxo
1. Usuária ativa behavior PROJECT.
2. Envia prompt: "Quero que o app rode offline."
3. A IA interpreta o prompt + conteúdo de PROJECT.md (SUB_SYSTEM_PROMPT).
4. Resposta é sempre ajustada ao contexto do projeto.

---

Este protocolo pode ser expandido com novos behaviors e automações conforme necessidade do projeto.

## Ideia futura: Prompts predefinidos reutilizáveis
- Possibilidade de criar, salvar, excluir e categorizar prompts predefinidos (tanto pelo app quanto manualmente em archives).
- Exemplos de uso: reforçar como definir tasks, padronizar nomes semânticos, fluxos recorrentes, etc.
- Usuária pode selecionar e enviar esses prompts rapidamente para a IA, renovando o contexto e acelerando o desenvolvimento.
- Facilita automação, padronização e reaproveitamento de conhecimento/processos recorrentes.
- Integração futura com os botões de salvar/excluir/limpar/repetir na UI.

## Objetivo ampliado do app
- Aprimorar o fluxo de desenvolvimento humano-IA, automatizando, organizando e acelerando tarefas recorrentes e criativas.
- Foco em adaptação ao estilo de trabalho da usuária, com máxima rastreabilidade e automação.
- Futuramente, integrar SentencePiece (ou similar) para que o app aprenda com os prompts da usuária e organize automaticamente o conhecimento, facilitando sugestões, agrupamentos e evolução do contexto.

## Aprendizado sobre tokenização e contexto
- Considerar limites de tokenização e janela de contexto dos modelos de IA.
- Futuras features: dividir prompts longos automaticamente em pedaços menores, respeitando a janela de contexto, para garantir que toda a informação seja processada corretamente.
- Todo o roadmap do app é guiado pela meta de aprimorar a comunicação humano-IA, com a IA sendo responsável por propor e implementar melhorias contínuas nesse fluxo.

## Referência de marcações e padrões de prompt (DICTIONARY.md)

- O arquivo docs/prompts/DICTIONARY.md consolida os padrões de marcação e formatação de prompts, detalhando como diferentes símbolos e estruturas são interpretados pela IA.
- Ele deve ser usado como referência central no admin para garantir prompts claros, padronizados e com máxima compatibilidade com modelos de IA.
- Sempre que for criar, refinar ou validar prompts, consultar o DICTIONARY.md para alinhar à melhor prática e garantir eficiência na comunicação IA-humano.
- As boas práticas e exemplos ali descritos devem ser seguidos e evoluídos conforme o projeto avança.

## Aprendizados e padrões extraídos do chat com ChatGPT (chat_export_viviane.md)

- **System Prompts enxutos e modulares:** Priorizar prompts curtos, objetivos e organizados em blocos (objetivo, regras, exemplos), usando Markdown para clareza e parsing eficiente pela IA.
- **Gestão de tokens:** Sempre medir e otimizar o tamanho dos prompts para não comprometer a janela de contexto dos modelos. Usar ferramentas como tiktoken/@dqbd/tiktoken para contagem e ajuste.
- **Dicionário de marcações:** Adotar padrões visuais (listas numeradas, títulos, blocos de código, etc.) para facilitar a interpretação da IA e garantir consistência na comunicação.
- **Pipeline Voz → Tasks:** Estruturar o fluxo em duas etapas: (1) brainstorm/registro de diretrizes (RD) por voz, acumulando tudo em um único arquivo; (2) refinamento e geração de tasks autônomas, sempre com aprovação manual antes de avançar.
- **Fluxo de aprovação:** Após transcrição e refinamento, sempre solicitar confirmação antes de salvar ou usar o resultado. Permitir regravação ou re-refinamento iterativo.
- **Persistência e versionamento:** Nunca apagar arquivos de guideline ou ERD; sempre versionar outputs e manter histórico para rastreabilidade.
- **Integração de padrões de projeto:** Carregar e considerar arquivos markdown em data/guideline/ como contexto fundamental para refinamento de tasks e alinhamento arquitetural.
- **Uso de modelos locais:** Priorizar modelos locais (Whisper, Silero, Ollama) para transcrição, interpretação e geração de tasks, visando economia e controle.
- **CLI interativa:** Interface baseada em inquirer e keypress, com feedback visual (emojis, cores), modularização clara dos comandos e prompts de confirmação.
- **Organização do RD:** O RD é um brainstorm contínuo, sem ordem rígida, e a IA é responsável por organizar e estruturar o conteúdo posteriormente.
- **Foco em ERP:** Todo o fluxo é orientado para apoiar o desenvolvimento e automação do ERP, respeitando padrões como vertical slice, SOLID, etc.

Esses aprendizados e padrões devem ser seguidos e evoluídos continuamente no desenvolvimento do admin e de todo o ecossistema.

## Fluxo Inteligente de Criação de Tasks

1. **Brainstorm/Definição**
   - Usuária grava ou digita tudo o que deseja (áudio/texto), sem se preocupar com ordem ou estrutura.
   - Transcrição automática (Whisper/Silero) gera texto bruto.
   - Texto é salvo e apresentado para revisão/edição.

2. **Refinamento**
   - Pipeline IA interpreta, agrupa e organiza ideias por intenção/contexto.
   - Gera tasks refinadas com: `title`, `description`, `module`, `systemPromptTarget`, `priority`, etc.
   - Tasks são apresentadas para aprovação. Se não aprovado, pode refinar/ajustar iterativamente.

3. **Geração e Output**
   - Tasks aprovadas são salvas em `data/tasks/` como `.md`, `.yaml` ou `.json`.
   - Tasks antigas podem ser sobrescritas automaticamente ao rodar o pipeline novamente.
   - Cada task pode conter campo `systemPromptTarget` para IA executora ideal.

4. **Execução e Rastreabilidade**
   - IA pode executar tasks, marcar como concluídas e fazer commit automático (ex: `git commit -m "feat: conclui <título da task>"`).
   - Todo o histórico de tasks, refinamentos e execuções é versionado.

5. **Integração com padrões e guidelines**
   - Pipeline lê arquivos de `data/guideline/` e `data/erd/` para alinhar tasks com padrões arquiteturais e requisitos do projeto.
   - Tasks geradas refletem as diretrizes e convenções definidas.

**Resumo:**
- O fluxo é iterativo, seguro (nada é salvo sem aprovação) e rastreável.
- Foco em automação, clareza e alinhamento com o contexto do projeto.

> Observação: O refinamento das tasks é realizado utilizando modelos open source locais (ex: Ollama, LLaMA, Mistral, DeepSeek, etc.), priorizando privacidade, economia e controle total do pipeline.

## Objetivo máximo da UI
- Interface bonita, minimalista e funcional: apenas o essencial para o fluxo voz → texto → envio.
- Feedback visual claro em todas as etapas (gravando, transcrevendo, pronto, enviado).
- Fluxo direto: falar → aparece no textbox → clicar em enviar → mensagem enviada automaticamente no chat.
- Automação de envio: ao clicar em enviar, o app automatiza mouse/teclado para colar e enviar no chat, restaurando a posição anterior.
- Modularidade: UI será construída de forma modular para facilitar evolução, adição de novos componentes e customização futura.

## Decisões de UI (mockup 2024-05-29)
- Botão de processamento (IA) e área de log acima da textbox são placeholders para funcionalidades futuras.
- Apenas a textbox é responsiva ao resize da janela; todos os outros elementos mantêm tamanho e posição fixa.
- Layout e espaçamento dos botões e áreas permanecem consistentes, independente do tamanho da janela.

## Detalhes do Mockup Refinado (2024-05-29)
- Linha de botões abaixo da área de log: histórico navegável (setas), desfazer/refazer (X), slider azul para tempo de reenvio automático, botão IA (processamento de texto), todos com ícones.
- Slider azul ajusta o tempo de reenvio automático do prompt (escala em minutos).
- Botão IA amarelo processa/otimiza o texto transcrito (placeholder para futura automação).
- Botão de marcar posição do chat com ícone, efeito de pulsar e contador de marcações.
- Reset automático da UI após envio.
- Feedback visual (pulsar, cor ativa) em todos os botões de ação.
- Histórico da textbox é apenas da sessão atual, permitindo navegação entre transcrições/edições.
- Observações didáticas sobre cada elemento para facilitar implementação fiel.

# Diretrizes e Objetivos do Projeto (atualizado)

- O frontend será desenvolvido em React, utilizando React-Bootstrap para garantir agilidade, padronização e aderência rápida aos mockups fornecidos.
- O backend será em Python, responsável por automações, requisições (requests) e integração com o chat do Cursor.
- O backend deve conter um miniapp dedicado para capturar e atualizar a posição do chat na tela, permitindo automação e controle preciso da interface.
- O objetivo central do projeto é facilitar a comunicação entre humano e IA, priorizando comandos de voz e comportamentos predefinidos para automação de tarefas.
- Toda diretriz, decisão de arquitetura ou ajuste relevante deve ser registrada neste arquivo para garantir rastreabilidade e alinhamento contínuo.

## Mudança de abordagem (__admin)

- Todas as tentativas anteriores de automação Python puro em __admin estão descontinuadas.
- A partir de agora, toda automação e integração será feita via backend Python (API REST) localizado em packages/admin/backend.
- O frontend será exclusivamente em React, utilizando React-Bootstrap para a interface e interação.
- O backend Python será responsável por expor endpoints REST para automações e integrações necessárias.
- Toda lógica de UI e interação será migrada/implementada no frontend React, seguindo os mockups e diretrizes do projeto.
- Esta decisão garante maior agilidade, padronização e rastreabilidade no desenvolvimento.

## Motivo da mudança e registro de frustração

- A mudança de abordagem foi motivada por frustração com a lentidão, complexidade e ineficiência da solução Python anterior, que consumiu horas sem entregar o resultado esperado.
- O objetivo agora é máxima agilidade e precisão, evitando qualquer repetição do passado.
- O padrão adotado (React + backend Python API REST) foi escolhido por ser comprovadamente mais rápido e produtivo, conforme experiência da usuária ao resolver o mesmo problema em Node.js em poucos minutos.
- Este registro serve como alerta permanente para priorizar soluções simples, diretas e eficientes.

## Entendimento do contexto do projeto (admin)

- O projeto admin é um módulo do ecossistema Project Manager, que visa orquestração, automação e integração de múltiplos agentes IA e humanos em uma interface moderna e flexível.
- O admin tem como objetivo central facilitar a comunicação entre a usuária (arquiteta) e o desenvolvedor (IA), priorizando comandos de voz, automação de tarefas e comportamentos predefinidos.
- O frontend é desenvolvido em React, com React-Bootstrap e Tailwind para agilidade, padronização e rápida aderência a mockups.
- O backend é em Python, servindo como API REST para automações, requests e integração com o chat do Cursor, incluindo um miniapp para capturar e atualizar a posição do chat na tela.
- O projeto segue arquitetura modular, evolutiva e rastreável, com decisões e diretrizes sempre documentadas neste arquivo.
- O admin se encaixa como interface dedicada e ágil dentro do ecossistema, alinhado ao padrão de componentização, automação e evolução incremental descrito no README principal.

## Diagramas de contexto e papel do admin

- Os diagramas `infratructure-diagram.png` e `client-diagram.png` representam a arquitetura macro do ecossistema Project Manager, detalhando fluxos, responsabilidades e integração entre módulos, agentes IA, servidores e clientes.
- O admin é uma ferramenta dedicada para facilitar, acelerar e automatizar o desenvolvimento e integração de novas features, automações e fluxos dentro desse ecossistema.
- Atua como ponte entre humano (arquiteta) e IA (desenvolvedor), permitindo experimentação, automação e evolução incremental alinhada à arquitetura e fluxos apresentados nos diagramas.
- Todas as decisões, integrações e implementações do admin devem considerar e respeitar o contexto arquitetural global, garantindo coesão, rastreabilidade e evolução harmônica do ecossistema.

## Padrões e dicas para contexto IA (MARCAÇÔES.md)

- O arquivo docs/prompts/MARCAÇÔES.md reúne padrões de marcação, dicas de boas práticas para prompts, exemplos de tokenização e wrappers para análise/compressão de prompts.
- Deve ser usado como referência complementar no admin para:
  - Melhorar clareza e estrutura dos prompts
  - Garantir compatibilidade máxima com modelos de IA
  - Aplicar técnicas de contagem e otimização de tokens (ex: tiktoken, sentencepiece)
- Sempre consultar MARCAÇÔES.md ao criar/refinar prompts, pipelines ou integrações que dependam de parsing eficiente e contexto enxuto para IA.

## Integração Backend Python (BFF) — Diretriz detalhada

- O backend Python será implementado como um BFF (Backend For Frontend) dedicado ao admin, atuando como ponte entre o frontend/admin e o server principal (Node/TypeScript).
- **Motivação:**
  - Python foi escolhido para o BFF devido à necessidade de automações específicas que exigem integração direta com o sistema operacional, ferramentas externas ou fluxos de automação que não são triviais em Node.
  - Exemplo central: receber textos transcritos por voz e automatizar o envio desses textos para o chat do Cursor, simulando ações de usuário ou interagindo com a interface do chat.
- **Papel do backend Python:**
  - Não substitui o server principal, mas complementa, servindo como camada de automação e integração para tarefas que exigem recursos do SO ou bibliotecas Python.
  - Expõe endpoints REST para o frontend/admin acionar automações, enviar textos, capturar/atualizar posição do chat, etc.
  - Pode ser expandido para outras automações futuras, sempre priorizando fluxos que acelerem a comunicação humano-IA e a produtividade da usuária.
- **Fluxo típico:**
  1. Usuária dita comando por voz → frontend transcreve e envia para backend Python via REST.
  2. Backend Python executa automação (ex: envia texto para o chat do Cursor, manipula UI, etc).
  3. Feedback é retornado ao frontend/admin para rastreabilidade e UX.
- **Expansão futura:**
  - O backend Python pode ser utilizado para outras integrações (ex: automação de janelas, scraping, integração com ferramentas desktop, etc), sempre mantendo a arquitetura modular e rastreável.
- **Rastreabilidade:**
  - Toda diretriz, motivação e decisão sobre o backend Python deve ser registrada nesta seção para garantir alinhamento e histórico de decisões.

## Diretriz de Componentização e Encapsulamento (React-Bootstrap)

- Todos os componentes visuais, mesmo que baseados em React-Bootstrap, devem ser encapsulados e exportados a partir da pasta `src/components` (ex: `src/components/ui/Button.tsx`).
- Nunca importar diretamente de `react-bootstrap` em páginas, rotas ou layouts. Sempre criar um wrapper/component personalizado em `@components` e importar a partir dele.
- Essa abordagem garante:
  - Padronização visual e de código
  - Facilidade de customização futura (ex: trocar React-Bootstrap por outra lib sem refatoração global)
  - Rastreabilidade e centralização dos componentes usados
  - Desacoplamento da biblioteca de UI
- Toda implementação, refatoração ou novo componente deve seguir esse padrão obrigatoriamente.

## Bibliotecas obrigatórias e validadas para o ecossistema

- As seguintes bibliotecas são de uso obrigatório e já validadas para o ecossistema admin:
  - `@tanstack/react-form` — gerenciamento de formulários
  - `@tanstack/react-query` — gerenciamento de queries, cache e sincronização de dados
  - `@tanstack/react-table` — tabelas dinâmicas e flexíveis
  - `zod` — validação e tipagem de dados
  - `zustand` — gerenciamento de estado global
- Toda solução de formulários, queries, tabelas, validação e estado deve priorizar essas libs.
- Outras bibliotecas só devem ser consideradas se houver justificativa técnica clara e registro prévio nesta documentação.

## Análise do Servidor Principal (Node/TypeScript)

- **Arquitetura:**
  - Baseado em Express, modular, com middlewares padronizados (CORS, cookies, logs, timeout, error handler global).
  - Porta padrão: 4000 (definida em .env ou constante DEFAULT_SERVER_PORT).
  - Prefixo global de API: `/api`.
  - Endpoints principais: `/models`, `/ask`, `/projects`, `/health`.
  - Suporte a múltiplos providers de IA (OpenAI, DeepSeek, Ollama, Perplexity, Speech, etc) via registry dinâmico.
  - Modelos e providers são resolvidos dinamicamente, com fallback e validação.
  - Toda resposta de erro é padronizada pelo middleware global.

- **Integração esperada com backend Python (BFF):**
  - O backend Python deve consumir endpoints REST do servidor principal, especialmente `/ask` (para prompts/IA) e `/projects` (para orquestração de projetos/tarefas).
  - URLs e portas são configuráveis via dotenv (ex: SERVER_BASE_URL).
  - O backend Python pode atuar como ponte para automações, transcrição de voz, marcação de posição de chat, etc, sempre integrando via API REST.

- **Pontos relevantes:**
  - O servidor principal já implementa lógica de roteamento, validação e fallback de modelos, facilitando integração e expansão.
  - O backend Python deve ser stateless e apenas orquestrar automações e integrações, sem duplicar lógica de negócio do servidor principal.
  - Toda automação ou recurso extra deve ser documentado e exposto via endpoints REST claros, mantendo rastreabilidade e desacoplamento.

- **Resumo:**
  - O backend Python/BFF é complementar, nunca concorrente ao servidor principal.
  - Toda integração deve ser feita via API REST, respeitando contratos e padrões já definidos no ecossistema.

> **Observação:**
> O arquivo PROJECT.md, em conjunto com o ERD, é o local central onde definimos o escopo, objetivos e funcionalidades do projeto. Toda decisão sobre o que o projeto vai fazer, suas integrações e automações deve ser registrada aqui.
> A ferramenta admin foi criada justamente para facilitar, automatizar e rastrear esse tipo de definição, tornando o processo de evolução do projeto mais ágil, transparente e colaborativo.

## Diretiva de armazenamento local
- O backend deve utilizar DuckDB como padrão para armazenamento local de dados.
- Toda feature que exigir persistência local deve priorizar DuckDB, garantindo performance, simplicidade e integração futura com análises e automações.

## Diretriz de arquitetura e organização
- O backend Python deve sempre se inspirar na arquitetura, organização e padrões do server principal (Node/TypeScript), adaptando para o contexto Python.
- Estruture o backend com separação clara por responsabilidade: lib/ para utilitários, routes/ para endpoints, tools/ para automações.
- Aplique SRP (Single Responsibility Principle) em todos os arquivos e módulos.
- Use abstrações e encapsulamentos para banco, logger, middlewares, helpers, etc.
- Documente exemplos de uso e boas práticas diretamente nos módulos.
- Evolua incrementalmente, sempre prevendo extensibilidade e rastreabilidade.
- A estrutura do server principal é referência para evolução e boas práticas do backend Python.

## Biblioteca de Padrões, Instruções e Advertências (archives)

- A pasta `archives` funciona como uma biblioteca de padrões, instruções, templates, advertências e mensagens recorrentes.
- Estrutura em subpastas/categorias (ex: testes, padrões, feedback, tasks, alertas, etc), cada uma contendo arquivos markdown reutilizáveis.
- Objetivos principais:
  - Permitir seleção rápida de instruções e padrões recorrentes, sem necessidade de digitar ou ditar novamente.
  - Facilitar reuso, padronização e agilidade no fluxo de trabalho.
  - Servir como repositório de advertências e alertas para uso manual ou automático (ex: detectar loops, comportamentos indesejados, situações de atenção).
  - Possibilitar edição pontual do conteúdo antes do envio (ex: adicionar detalhes de projeto/contexto).
- Não há histórico, undo/redo ou versionamento automático nesse fluxo — é para uso rápido e direto.
- Busca rápida por nome/conteúdo para localizar o arquivo desejado sem navegação manual.
- Flexível para crescer com novas categorias e padrões conforme o projeto evolui.

**Diretriz:**
- Tudo que for passado e compreendido deve ser anotado na seção correspondente deste arquivo (PROJECT.md), garantindo rastreabilidade e organização por assunto.

## Histórico Local e Undo/Redo por Chat
- Cada chat/histórico mantém seu próprio buffer de undo/redo.
- Estrutura de estado:
```js
{
  currentText: string,
  undoStack: string[], // máx. 50
  redoStack: string[], // máx. 50
}
```
- O histórico é volátil (memória local, some ao fechar/recarregar).
- Permite navegar, recuperar e editar mensagens anteriores.
- Mantido em contexto React (ex: Zustand, Context API, Redux).
- Suporta múltiplos históricos (sessões, threads, etc).
- Navegação instantânea, sem recarregar a página.
- Undo/redo com ícones visuais (seta curvada para trás/para frente).
- Limite padrão: 50 para trás, 50 para frente (100 modificações por chat).

## Behaviors e Reforço de Contexto
- Behaviors são modos de operação configuráveis que mudam a forma como a IA interpreta e executa instruções.
- O behavior "GENERIC" é o padrão e não adiciona contexto extra.
- Behaviors específicos (PROJECT, FEEDBACK, CONTEXT, etc) adicionam um reforço de contexto ao final do prompt, instruindo a IA sobre como agir.
- Exemplo: behavior PROJECT → "Você deve anotar isso no PROJECT.md e interpretar como um padrão de projeto, funcionalidade ou informação relevante."
- O comportamento pode ser trocado a qualquer momento, mudando imediatamente a postura da IA.
- Comportamento PROJECT: tudo que for detalhado deve ser registrado fielmente no PROJECT.md.

## Integração SentencePiece e Controle de Contexto
- SentencePiece será integrado ao backend Python para tokenização, compressão, sumarização e adaptação do texto, otimizando o uso do contexto da IA.
- O uso do SentencePiece (ou qualquer pré-processador) será opcional e controlado pela interface: toggle para ativar/desativar, undo para desfazer.
- Toda manipulação automática de texto será reversível, transparente e sob controle do usuário.
- O limite de contexto da IA é a soma de todos os tokens enviados (system prompt, histórico, pergunta, resposta, etc).
- Fórmula prática: System Prompt + Instruções + Histórico + Resposta <= Tamanho da Janela.
- Boas práticas: system prompt enxuto (≤ 500 tokens), histórico só do relevante, behaviors e tokenização para otimizar cada mensagem.

## Diretriz behavior PROJECT
- Comportamento PROJECT garante que tudo que for detalhado seja anotado fielmente no PROJECT.md, sem perder nenhuma informação ou decisão.
- O behavior selecionado define a postura da IA e o que fazer com cada mensagem, reforçando o contexto e o objetivo do momento.
- Com behavior PROJECT ativo, cada instrução, ideia ou padrão é registrada automaticamente, evitando qualquer perda de informação ou desalinhamento.

## Padrão de Delimitador para Behaviors e Validação Cross-Model
- O padrão de behavior/contexto será delimitado por `:::` (três dois-pontos) por enquanto, pois é visualmente distinto, compatível com GPT-4 e fácil de parsear.
- Exemplo:
```
:::
PROJECT - tudo deve ser anotado no PROJECT.md do projeto atual...
:::
```
- Futuramente, será realizada uma POC/teste técnico com outros modelos de LLM (ex: Llama, Mistral, Claude, Gemini, etc) para validar se interpretam o delimitador da mesma forma.
- O objetivo é garantir compatibilidade e clareza universal, ajustando o padrão se necessário após validação cross-model.
- Manter este experimento registrado para priorização e rastreabilidade.

## Padrão de Arquivo de Behavior (2024-06)

Cada arquivo de behavior deve seguir o seguinte padrão de marcação de propriedades:

```
# NOME: <nome_do_behavior>

# DESCRICAO: <descrição curta do behavior>

# DETALHE:
<detalhamento, exemplos, instruções, etc>
```

- Cada propriedade começa com `# NOME:`, `# DESCRICAO:`, `# DETALHE:` (pode expandir para outras no futuro, ex: `# EXEMPLO:`)
- O parser deve buscar por essas tags e associar o valor à propriedade correspondente
- Ordem das propriedades pode ser flexível, mas recomenda-se seguir o modelo acima
- Se faltar alguma propriedade, o sistema deve lidar de forma resiliente (exibir só o que existir)
- Permite parsing automático, flexível e expansível para novos behaviors

Exemplo:

```
# NOME: FEEDBACK

# DESCRICAO: Para comandos diretos, correções ou ajustes. IA executa exatamente o que for solicitado.

# DETALHE:
Use este behavior para dar instruções diretas, correções ou pedidos de ajuste. Ao ativar, a IA deve executar exatamente o que for solicitado, sem questionar prioridades ou pedir confirmação, exceto se algo for realmente necessário. Exemplo: "Aumente o tamanho do botão", "Corrija o fundo", "Implemente testes para estes arquivos".
```

BEHAVIOR (Behavior)
> Use este behavior para definir o modo de atuação da IA. Ao ativar, detalhe como a IA deve se comportar: mais crítica, questionadora, proativa, comunicativa ou seguindo regras específicas. Exemplo: "Questione todas as funcionalidades", "Execute tasks do TASKS.md de forma autônoma", "Explique sempre o motivo das implementações".
FEEDBACK (Behavior)
> Use este behavior para dar comandos diretos, correções ou ajustes. Ao ativar, a IA executa exatamente o que for solicitado, sem questionar prioridades ou pedir confirmação, exceto se algo for realmente necessário. Exemplo: "Aumente o tamanho do botão", "Corrija o fundo", "Implemente testes para estes arquivos".
CONTEXT (Behavior)
> Use este behavior para mudar completamente o foco ou contexto do trabalho. Ao ativar, tudo que for detalhado passa a ser o novo contexto, ignorando o anterior. Exemplo: trocar de projeto, repositório ou área do ecossistema. Útil para evitar confusão em múltiplos workspaces ou mudanças de objetivo.
PROJECT (Behavior)
> Use este behavior para registrar fielmente no PROJECT.md tudo que for detalhado enquanto estiver ativo. Ideal para documentar decisões, padrões e aprendizados do projeto.

## Diretriz: Reforço Automático de Execução via Slider

- O slider azul na UI define o intervalo (em minutos) para reenvio automático de prompts para a IA.
- Útil para casos em que a IA não executa as tasks corretamente ou entra em loop de confirmação.
- Permite que a usuária realize outras tarefas enquanto a IA é periodicamente lembrada de executar/completar as tasks.
- O prompt de reforço pode ser customizado e salvo em arquivos markdown na pasta `archives` (ex: `archives/reforco/EXECUTE_TASKS.md`).
- Exemplo de prompt de reforço: "Você já executou todas as tasks? Continue até finalizar todas, sem aguardar novas confirmações."
- O sistema pode ler arquivos de tasks (TASKS.md) e enviar cada task individualmente ou em lote, conforme configuração.
- Feature avançada: pipeline que lê PROJECT.md, arquivos de diretivas e GUIDELINES, e transforma em TASKS.md priorizadas, identificando dependências entre tasks.
- Esse pipeline pode ser IA-driven, permitindo automação do planejamento e execução incremental do projeto.

## Referência de Pipeline Inteligente para Tasks

- O pipeline descrito em `docs/pipelines/taskspipe.md` será usado como base para automação de decomposição, priorização e exportação de tasks a partir de PROJECT.md, ERD e arquivos de diretivas.
- O fluxo cobre desde a entrada do requisito, decomposição (Chain of Thought), detalhamento técnico, priorização, até exportação em markdown/JSON.
- Permite integração com múltiplos modelos de IA e orquestração automatizada.
- O objetivo é transformar rapidamente requisitos em tasks implementáveis, priorizadas e justificadas, acelerando o desenvolvimento e garantindo rastreabilidade.

# Visão, Conceitos e Papel do Projeto Admin no Ecossistema

## Visão Geral
O projeto admin é o núcleo de orquestração, automação e governança do ecossistema Project Manager. Ele foi concebido para ser a principal interface entre humano e IA, acelerando o desenvolvimento, padronizando fluxos e garantindo rastreabilidade total.

## Onde o Projeto se Encaixa
- Atua como mediador entre a usuária (arquiteta) e os agentes IA, centralizando comandos, feedbacks e automações.
- Serve como "ferramenta-mãe" para criar, testar, validar e evoluir todos os outros módulos e aplicações do ecossistema.
- É o ponto de entrada para experimentação, refinamento de processos e integração de novos perfis, skills e pipelines de IA.
- Facilita o desenvolvimento paralelo, desacoplado de IDEs, permitindo múltiplos fluxos simultâneos e automação de ponta a ponta.

## Contribuições para o Ecossistema
- Garante padronização, governança e versionamento de todos os fluxos, behaviors e integrações.
- Proporciona rastreabilidade e auditoria total de decisões, execuções e aprendizados.
- Permite automação inteligente de tarefas, reforço de contexto e adaptação contínua ao estilo de trabalho da usuária.
- Centraliza documentação, experimentos, métricas e validação de hipóteses, promovendo cultura de engenharia e melhoria contínua.
- Serve como laboratório para validação de novos conceitos, automações e integrações, antes de escalar para o restante do ecossistema.

## Visão de Futuro
- Evoluir para uma plataforma de orquestração multi-agente, com explainability, telemetria, simulação e gestão de perfis/skills de IA.
- Ser referência em automação, governança e experimentação de projetos IA-driven, inspirando outros ecossistemas e comunidades.

## Papel Estratégico do Admin: Prototipação, Validação e Reuso

O admin não é uma aplicação final isolada, mas sim um ambiente de experimentação, prototipação e validação contínua, construído em vertical slice. Seu objetivo é:

- Permitir desenvolver, testar e validar features, automações e integrações de forma rápida, sem depender do cliente principal.
- Servir como "laboratório" para validar ideias, fluxos, automações e ferramentas que depois podem ser incorporadas ao cliente principal ou ao servidor, sem retrabalho.
- Tudo que é criado aqui pode ser reaproveitado em qualquer parte do ecossistema, graças à arquitetura vertical slice e modular.
- O servidor principal também pode ser desacoplado e transformado em microserviço a qualquer momento, mantendo a flexibilidade e escalabilidade.

### Exemplos de uso e validação no admin:
- Prototipar e validar integração com SentencePiece, ajustando tokenização e compressão ao estilo de escrita da usuária.
- Experimentar e automatizar pipelines de finetuning, usando dados e prompts reais do ecossistema.
- Analisar, estruturar e validar pipelines entre diferentes modelos de IA para execução de tarefas complexas.
- Prototipar e validar features de backend (ex: tools, automações) que depois serão utilizadas no servidor principal.
- Testar diferentes estratégias de system prompt, passagem de contexto e execução de tasks, medindo impacto e performance.
- Analisar e comparar diferentes modelos de IA, usando métricas reais e casos de uso do ecossistema.

**Resumo:**
O admin acelera o desenvolvimento, validação e evolução do ecossistema, garantindo que tudo seja testado, refinado e pronto para ser incorporado ao cliente principal ou ao servidor, sem desperdício ou retrabalho.

## Protocolo para Descoberta e Documentação da Janela de Contexto dos Modelos IA

Saber a janela de contexto (context window) de cada modelo IA é fundamental para otimizar prompts, evitar perda de informação e garantir máxima eficiência no ecossistema.

### 1. Pesquisa Direta
- Consultar documentação oficial, repositórios, papers ou sites dos providers.
- Perguntar diretamente ao modelo (quando possível): "Qual é o seu limite de tokens/contexto?"
- Registrar a resposta, mas sempre validar com experimentos práticos.

### 2. Experimento de Inferência Prática
- Enviar prompt longo, numerado (ex: 1, 2, 3, ..., N), cada linha com uma palavra/frase única.
- Ao final, perguntar: "Repita todas as linhas que você recebeu."
- Aumentar o tamanho do prompt progressivamente até a IA começar a esquecer/omitir linhas do início.
- O ponto em que ela começa a "esquecer" marca o limite prático da janela de contexto.
- Repetir o teste com diferentes tipos de conteúdo (texto puro, código, markdown) para validar consistência.

#### Exemplo de Prompt:
```
1. linha1
2. linha2
...
2048. linha2048

Por favor, repita todas as linhas que você recebeu.
```

### 3. Automação do Processo
- Criar script que gera prompts numerados, envia para o modelo via API, analisa a resposta e identifica até qual linha a IA conseguiu lembrar.
- Gerar relatório automático com o "context window" prático do modelo.

### 4. Documentação no Ecossistema
- Criar arquivo markdown (ex: `docs/models/context-windows.md`) com:
  - Nome do modelo
  - Janela de contexto inferida (em tokens/linhas)
  - Data do teste
  - Observações (ex: comportamento com markdown, código, etc)
- Atualizar sempre que testar novos modelos ou versões.

### 5. Integração com o Admin
- Adicionar painel/tela para visualizar e comparar as janelas de contexto dos modelos disponíveis.
- Permitir rodar o experimento direto do admin para novos modelos.

#### Exemplo de Output:
```markdown
# Janelas de Contexto dos Modelos

| Modelo       | Janela (tokens) | Data Teste | Observações              |
| ------------ | --------------- | ---------- | ------------------------ |
| GPT-4        | 128k            | 2024-06-20 | Confirmado via API       |
| Llama-3      | 8k              | 2024-06-20 | Inferido por experimento |
| DeepSeek-67B | 32k             | 2024-06-20 | Esquece após 32k tokens  |
| Mistral-7B   | 8k              | 2024-06-20 | Teste prático            |
```

**Resumo:**
Esse protocolo garante rastreabilidade, eficiência e alinhamento na utilização de diferentes modelos IA no ecossistema, permitindo otimização contínua dos fluxos de prompt e passagem de contexto.
