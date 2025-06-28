aplica o codigo e vamos validar
Cursor
python
import os
import re
from collections import defaultdict Counter
from nltkcorpus import stopwords
DATASET_DIR  packagesalivedataset
OUTPUT_FILE  packagesaliveoutputkeywords_validationmd
USER_HEADER_PATTERN  recompilerUser reMULTILINE
SECTION_SEPARATOR_PATTERN  recompiler reMULTILINE
 Carregar stopwords em português
STOPWORDS  setstopwordswordsportuguese
except LookupError
import nltk
nltkdownloadstopwords
STOPWORDS  setstopwordswordsportuguese
 Função para extrair mensagens do User de um arquivo markdown
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
def is_stopword_ngramngram
 True se todos os tokens do ngrama são stopwords
return alltoken in STOPWORDS for token in ngramsplit
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