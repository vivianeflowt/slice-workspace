stringsimilarity e temos tm fastestlevendes
Cursor
 Registrado além de stringsimilarity também temos a opção de usar fastestlevenshtein para cálculo de similaridadeagrupamento textual
 stringsimilarity útil para comparação de frasestrechos fácil de usar
 fastestlevenshtein extremamente rápido para distância de Levenshtein ideal para grandes volumes ou quando performance for crítica
Ambas podem ser incluídas e testadas nos experimentos para escolher a melhor para cada caso de uso
User
sempre usar lodash pq é robusto e testado de preferende lodashfp usando ele de forma funcionalk
Cursor
 Confirmado lodash será sempre utilizado para manipulação de dados priorizando o uso do lodashfp para favorecer o estilo funcional composição e imutabilidade
 lodash robusto testado padrão de mercado
 lodashfp facilita pipelines funcionais evita efeitos colaterais melhora legibilidade e manutenção