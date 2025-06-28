Posso implementar esse ajuste no seu script para garantir chunking preciso seguro e automático
Confirma para eu aplicar
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
User
so vc fazer uma coisa dividir o mesmo arquivo em 3 pedaços diferentes
tipo mesmo que corte um assunto no meio com 3 resultados vc consegue reagrupar
Cursor
python
import os
import sys
from typing import List
  código existente 
def split_in_n_chunkstext str n int  Liststr
Divide o texto em n pedaços de tamanho igual em linhas mesmo que corte assuntos no meio
lines  textsplitn
chunk_size  lenlines  n
chunks  
for i in rangen
start  i  chunk_size
 O último chunk pega o resto
end  i  1  chunk_size if i  n  1 else lenlines
chunksappendnjoinlinesstartend
return chunks