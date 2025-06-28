 Limitações que queremos observar no baseline
 Só detecta mudanças explícitas não transições sutis
 Pode agrupar assuntos diferentes se não houver palavrachave clara
 Não entende contexto só padrões de texto
 Vantagem
 Rápido de implementar fácil de ajustar a lista de palavraschave
 Serve como baseline para comparar com abordagens baseadas em LLMembeddings
Se quiser posso implementar esse baseline agora no seu pipeline
Quer sugerir palavraschave específicas para o seu contexto ou uso a lista acima como ponto de partida
python
import re
 Lista de palavrasfrases que indicam mudança de assunto
SEPARADORES  
rnovo problema rpróximo assunto rmudando de tópico ragora vamos
rcorrigir erro rseguinte routra questão r
def separar_assuntosconversa
assuntos  
assunto_atual  
for bloco in conversa
if anyresearchsep bloco reIGNORECASE for sep in SEPARADORES
if assunto_atual
assuntosappendassunto_atual
assunto_atual  
assunto_atualappendbloco
if assunto_atual
assuntosappendassunto_atual
return assuntos
 Exemplo de uso
 conversa    lista de blocosmensagens
 assuntos  separar_assuntosconversa
 for i assunto in enumerateassuntos
 with openfassunto_i102md w as f
 fwritennjoinassunto
User
Mas como vc descobrir as palavras chaves
Cursor