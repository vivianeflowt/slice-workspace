Todos os exemplos e scripts de teste do projeto ERD usarão Vitest como padrão
User
crie um GUIDELINEmd com essas definicoes e como vai estruturar o projeto e com cada lib pra eu avaliar e validar
Cursor
markdown
 GUIDELINEmd  Padrão Técnico do Projeto ERD
 1 Estrutura de Diretórios
packageserd
src  Códigofonte principal lógica módulos utils
cli  Entrypoints CLI e comandos
utils  Utilitários compartilhados
logs  Logs de execução e experimentos
tests  Testes automatizados Vitest
examples  Exemplos de entradasaída e experimentos
config  Configurações centralizadas configtsjson
docs  Documentação adicional
 2 Bibliotecas e Ferramentas
 TypeScript  Linguagem principal tipagem forte
 commander  CLI robusta e extensível
 inquirer  Prompts interativos opcional para UX avançada
 colorette  Colorização de logsCLI leve compatível CJSESM
 fsextra  Operações de arquivo seguras e avançadas
 dotenv  Gerenciamento de variáveis de ambiente
 axios  Requisições HTTP para engines de IA
 lodashfp  Utilitários funcionais composição imutabilidade sempre preferir lodashfp
 stringsimilarity  Similaridade textual agrupamento chunking
 fastestlevenshtein  Distância de Levenshtein ultrarrápida opcional para grandes volumes
 natural ou compromise  NLP básico tokenização análise semântica opcional
 winston ou pino  Logging estruturado e persistente
 dayjs  Manipulação de datas para logsexperimentos
 markdownit  Parserrenderizador de Markdown se necessário
 ora  Spinnersfeedback visual na CLI opcional
 vitest  Testes automatizados substitui Jest
 3 Padrões de Código