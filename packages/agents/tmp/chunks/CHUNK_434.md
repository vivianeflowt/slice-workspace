Se quiser algum detalhe extra na justificativa só avisar
Pronto para rodar a extração e gerar o arquivo de validação nesse formato
plaintext
 corrigir erro
 Dataset chat01md Linha 1234
Mensagem Agora vamos corrigir o erro do protocolo de tokenização
Contexto anterior O pipeline está quase pronto mas falta ajustar um detalhe
Contexto posterior Depois disso podemos testar novamente
Justificativa Aparece no início da mensagem padrão recorrente em transições de assunto
 Dataset chat03md Linha 5678
Mensagem Corrigir erro de conexão é prioridade agora
Contexto anterior A conexão está instável desde ontem
Contexto posterior Se resolver seguimos para o próximo passo
Justificativa Expressão usada para iniciar novo objetivo na conversa
 até 10 exemplos
User
pode aplicar que vai dar bom e vamos ajustando
Cursor
python
import os
import re
from collections import defaultdict Counter
DATASET_DIR  dataset
OUTPUT_FILE  outputkeywords_validationmd
USER_PATTERN  recompilerUser reMULTILINE
SEPARATOR_PATTERN  recompiler reMULTILINE