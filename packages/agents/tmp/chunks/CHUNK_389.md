 3 Embeddings e Agrupamento Semântico
 Recomendado
 nomicembedtext para busca semântica clustering deduplicação
Pode ser usado para
 Agrupar mensagens similares
 Buscar tópicos recorrentes
 Deduplicar blocos redundantes
 4 Multimodalidade caso haja imagenstexto
 Recomendado
 llava13b
 granite32visionlatest
Se algum dataset envolver imagens ou precisar de análise visual esses modelos são adequados
 Pipeline Sugerido com os modelos disponíveis
1 Préprocessamento
 Use nomicembedtext para agrupar mensagens similares e identificar tópicos
2 Segmentação
 Use llama370b ou mistral8x7b para separar blocos de conversa por assuntocontexto
3 Sumarização
 Use llama370b wizardlm8x22b ou openchat7b para gerar resumos macro de cada bloco
4 Processamento de grandes volumes
 Se necessário use deepseekcoder33b para textos muito longos ou complexos
5 Documentação e rastreabilidade
 Registre prompts outputs e decisões no CONTECTmd