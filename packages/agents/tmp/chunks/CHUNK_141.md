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
 Estilo funcional
 Sempre priorizar lodashfp para manipulação de dados
 Evitar mutação de objetosarrays preferir funções puras
 Composição de funções para pipelines de processamento
 Estrutura modular
 Separar lógica de negócio CLI utilitários e integrações
 Centralizar configurações em config
 Logs e experimentos
 Todos os experimentos devem ser registrados em logs
 Logging estruturado winstonpino e colorido colorette
 Testes
 Todos os módulos devem ter cobertura de testes com Vitest
 Testes em tests e exemplos reais em examples
 Documentação
 Manter PROJECTmd e GUIDELINEmd sempre atualizados
 Documentar experimentos prompts parâmetros e resultados
 4 Convenções
 Nomenclatura
 Funções camelCase
 Classes PascalCase
 Constantes UPPER_SNAKE_CASE
 Importação
 Sempre usar imports explícitos de lodashfp import  map filter  from lodashfp
 Configuração
 Variáveis sensíveis e parâmetros em env ou config
 CLI
 Todos os comandos devem ser documentados com exemplos de uso
 5 Fluxo de Desenvolvimento