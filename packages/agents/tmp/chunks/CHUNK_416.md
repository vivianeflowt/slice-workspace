 Heurística Simples para Separação de Assuntos
 1 Préprocessamento
 Ler o arquivo markdownchat
 Dividir a conversa em blocosmensagens ex por linhas por turnos UserIA ou por delimitadores como 
 2 Definir Palavraschave e Separadores
 Criar uma lista de palavrasfrases que indicam possível mudança de assunto por exemplo
 novo problema próximo assunto mudando de tópico agora vamos corrigir erro seguinte outra questão etc
 Incluir separadores explícitos do markdown como  se existirem
 3 Algoritmo de Separação
 Percorrer a lista de blocosmensagens sequencialmente
 Sempre que encontrar uma palavrachave ou separador explícito iniciar um novo assunto
 Agrupar todas as mensagens entre dois separadorespalavraschave como pertencentes ao mesmo assunto
 4 Output
 Para cada assunto detectado salvar um arquivo markdown assunto_01md assunto_02md  preservando a ordem e o conteúdo original dos blocos
 Exemplo de Código PseudoPython
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