Cursor
python
import os
import re
from collections import defaultdict Counter
DATASET_DIR  packagesalivedataset
OUTPUT_FILE  packagesaliveoutputkeywords_validationmd
USER_HEADER_PATTERN  recompilerUser reMULTILINE
SECTION_SEPARATOR_PATTERN  recompiler reMULTILINE
def extract_user_messagesfilepath
user_messages  
with openfilepath r encodingutf8 as file
lines  filereadlines
idx  0
while idx  lenlines
if linesidxstrip  User
message_lines  
start_line  idx
idx  1
while idx  lenlines and not linesidxstartswith and not SECTION_SEPARATOR_PATTERNmatchlinesidxstrip
message_linesappendlinesidxstrip
idx  1
if message_lines
user_messagesappendtext  joinmessage_lines line start_line  1
else
idx  1
return user_messages
def tokenizetext
return refindallrbwb textlower
def main
markdown_files  filename for filename in oslistdirDATASET_DIR if filenameendswithmd
user_messages  
for filename in markdown_files
filepath  ospathjoinDATASET_DIR filename
for message in extract_user_messagesfilepath
messagedataset  filename
user_messagesappendmessage
printfTotal de mensagens do User extraídas lenuser_messages
if user_messages
printExemplo de mensagem extraída user_messages0text
unigram_counter  Counter
bigram_counter  Counter
trigram_counter  Counter
for message in user_messages
tokens  tokenizemessagetext
if tokens
for t in tokens
unigram_countert  1
for i in rangelentokens1
bigram_counter jointokensii2  1
for i in rangelentokens2
trigram_counter jointokensii3  1
top_keywords  set
w for w _ in unigram_countermost_common10 
w for w _ in bigram_countermost_common10 
w for w _ in trigram_countermost_common10
printfKeywords encontradas top_keywords
keyword_examples  defaultdictlist
for keyword in top_keywords
for idx message in enumerateuser_messages
if keyword in messagetextlower
prev_context  user_messagesidx  1text if idx  0 else 
next_context  user_messagesidx  1text if idx  lenuser_messages  1 else 
justification  Aparece em algum ponto da mensagem
if messagetextlowerstartswithkeyword
justification  Aparece no início da mensagem padrão frequente
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