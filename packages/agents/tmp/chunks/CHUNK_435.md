 Função para extrair mensagens do User de um arquivo markdown
def extract_user_messagesfilepath
messages  
with openfilepath r encodingutf8 as f
lines  freadlines
i  0
while i  lenlines
if linesistrip  User
msg  
start  i
i  1
while i  lenlines and not linesistartswith and not SEPARATOR_PATTERNmatchlinesistrip
msgappendlinesistrip
i  1
if msg
messagesappendtext  joinmsg line start1
else
i  1
return messages
 Tokenização simples por palavras
def tokenizetext
return refindallrbwb textlower
def main
datasets  f for f in oslistdirDATASET_DIR if fendswithmd
all_msgs  
for ds in datasets
path  ospathjoinDATASET_DIR ds
msgs  extract_user_messagespath
for m in msgs
all_msgsappenddataset ds line mline text mtext
 Coletar inícios de frase bigramas trigramas
start_words  Counter
bigrams  Counter
trigrams  Counter
for m in all_msgs
tokens  tokenizemtext
if tokens
start_wordstokens0  1
if lentokens  1
bigrams jointokens2  1
if lentokens  2
trigrams jointokens3  1
 Selecionar top keywords inícios bigramas trigramas
keywords  setw for w _ in start_wordsmost_common10 
w for w _ in bigramsmost_common10 
w for w _ in trigramsmost_common10
 Mapear exemplos para cada keyword
keyword_examples  defaultdictlist
for kw in keywords
for m in all_msgs
if mtextlowerstartswithkw
idx  all_msgsindexm
contexto_ant  all_msgsidx1text if idx  0 else 
contexto_pos  all_msgsidx1text if idx  lenall_msgs1 else 
keyword_exampleskwappend
dataset mdataset
line mline
msg mtext
contexto_ant contexto_ant
contexto_pos contexto_pos
justificativa fAparece no início da mensagem padrão frequente
if lenkeyword_exampleskw  10
break
 Gerar arquivo markdown para validação
with openOUTPUT_FILE w encodingutf8 as out
for kw exemplos in keyword_examplesitems
outwritef kwnn
for ex in exemplos
outwritef Dataset exdataset Linha exlinen
outwritef Mensagem exmsgn
outwritef Contexto anterior excontexto_antn
outwritef Contexto posterior excontexto_posn
outwritef Justificativa exjustificativann
if __name__  __main__
main
python
DATASET_DIR  packagesalivedataset
OUTPUT_FILE  packagesaliveoutputkeywords_validationmd