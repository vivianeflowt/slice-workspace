 Como resolver
 1 Remover stopwords e conectivos
 Usar uma lista de stopwords em português para filtrar palavrasbigramastrigramas irrelevantes
 Focar em expressões mais longas e específicas
 2 Focar em padrões de transição
 Procurar por frases que indicam mudança de objetivo não apenas palavras isoladas
 Exemplo agora vamos próximo passo mudando de assunto seguinte problema sobre outro ponto
 3 Aumentar o tamanho dos ngramas
 Bigramastrigramas são mais informativos que unigramas
 Expressões como quero que agora vamos próximo problema têm mais chance de indicar transição
 4 Opcional Análise semântica
 Usar embeddings para clusterizar mensagens por similaridade de tema não só por palavras
 Exemplo de ajuste no pipeline
 Adicionar uma lista de stopwords ex eu vc a e de o um para etc
 Só considerar keywords que não sejam stopwords e que tenham pelo menos 2 palavras
 Gerar exemplos apenas para expressões mais ricas
 Resposta direta à sua pergunta
 Exemplo eu quero que vc ajuste o script
 Como vc separa por contexto isso
 Não separa só porque tem eu ou vc
 Só separa se encontrar uma expressão de transição de assunto como agora vamos corrigir próximo problema mudando de assunto
 O pipeline deve ignorar keywords genéricas e focar em padrões de transição reais