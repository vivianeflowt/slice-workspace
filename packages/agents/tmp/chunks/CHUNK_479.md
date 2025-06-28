bigram_counter  Counter
trigram_counter  Counter
for message in user_messages
tokens  tokenizemessagetext
 Contar bigramas
for i in rangelentokens1
bigram   jointokensii2
if not is_stopword_ngrambigram
bigram_counterbigram  1
 Contar trigramas
for i in rangelentokens2
trigram   jointokensii3
if not is_stopword_ngramtrigram
trigram_countertrigram  1
 Selecionar top keywords bigramas e trigramas
top_keywords  set
w for w _ in bigram_countermost_common15 
w for w _ in trigram_countermost_common15
printfKeywords compostas encontradas top_keywords
keyword_examples  defaultdictlist
for keyword in top_keywords
for idx message in enumerateuser_messages
if keyword in messagetextlower
prev_context  user_messagesidx  1text if idx  0 else 
next_context  user_messagesidx  1text if idx  lenuser_messages  1 else 
justification  Expressão composta relevante bigramtrigram presente na mensagem
keyword_exampleskeywordappend
dataset messagedataset
line messageline
text messagetext
prev_context prev_context
next_context next_context
justification justification
if lenkeyword_exampleskeyword  10
break
if keyword_exampleskeyword
printfExemplos para keyword keyword lenkeyword_exampleskeyword
with openOUTPUT_FILE w encodingutf8 as output_file
if not keyword_examples
output_filewriteNenhuma keyword composta relevante encontrada nos datasets Reveja o critério de extração ou o formato dos dados
else
for keyword examples in keyword_examplesitems
output_filewritef keywordnn
for example in examples
output_filewritef Dataset exampledataset Line examplelinen
output_filewritef Message exampletextn
output_filewritef Previous context exampleprev_contextn
output_filewritef Next context examplenext_contextn
output_filewritef Justification examplejustificationnn
if __name__  __main__
main
O pipeline de extração de keywords compostas foi executado com sucesso
 O script filtrou stopwords em português focou em bigramastrigramas e gerou o arquivo outputkeywords_validationmd com exemplos contextualizados para cada expressão composta relevante
 O output está no formato validável com contexto anteriorposterior e justificativa para cada ocorrência
 As keywords extraídas refletem padrões reais de mudança de assunto intenção e contexto alinhadas com os critérios discutidos
Próximos passos recomendados
 Realizar validação humana das keywords e exemplos no arquivo markdown
 Ajustar critérios ou lista de stopwords se necessário com base no feedback
 Iterar o pipeline para refinar ainda mais a segmentação de contexto
Se quiser rodar novos experimentos ajustar parâmetros ou integrar outras técnicas TFIDF embeddings clusterização posso propor e aplicar rapidamente Pronto para o próximo ciclo de validação ou evolução do pipeline