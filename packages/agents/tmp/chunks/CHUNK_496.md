Cursor
Consigo sim Posso calcular o chunking de forma precisa considerando
 Tamanho real do arquivo em tokens palavras ou linhas
 Janela de contexto do modelo ex 100k 128k tokens
 Margem de segurança para não estourar o limite do modelo
 Como fazer o chunking preciso
1 Conte o número de tokens do arquivo
 O ideal é usar uma função de tokenização compatível com o modelo ex tiktoken para OpenAI tokenizer do transformers para DeepSeek
 Se não disponível use número de palavras como aproximação 1 token  075 palavra em português
2 Divida pelo limite do modelo
 Exemplo arquivo tem 240000 tokens modelo suporta 100000  3 chunks de 80000 tokens margem de segurança
3 Ajuste o script para chunking automático
 O script pode calcular o tamanho do chunk dinamicamente e dividir o arquivo de acordo
 Exemplo de ajuste no pipeline
python
def count_tokenstext tokenizerNone
if tokenizer
return lentokenizerencodetext
 fallback aproximação por palavras
return lentextsplit
def chunk_text_by_tokenstext max_tokens tokenizerNone
words  textsplit
chunks  
current_chunk  
current_tokens  0
for word in words
current_chunkappendword
current_tokens  1  ou tokenizerencodeword se disponível
if current_tokens  max_tokens
chunksappend joincurrent_chunk
current_chunk  
current_tokens  0
if current_chunk
chunksappend joincurrent_chunk
return chunks