 Como funciona na prática
 Passos básicos
Treinamento opcional você pode treinar seu próprio vocabulário baseado em corpora com spm_train
Tokenização transforma texto em IDs de tokens
Detokenização transforma IDs de tokens de volta em texto
 Instalação
Python oficial
pip install sentencepiece
 Exemplo de uso com Python
import sentencepiece as spm
 Carrega o modelo já treinado ex LLaMA usa o seu próprio model
sp  spmSentencePieceProcessor
sploadllamamodel
texto  Vamos testar o tokenizador SentencePiece
tokens  spencodetexto out_typeint
tokens_texto  spencodetexto out_typestr
printIDs dos tokens tokens
printTokens texto tokens_texto
 O que ele faz de diferente do GPTOpenAI
AspectoSentencePieceTiktoken OpenAI
TipoBPE ou UnigramBPE
Treinável Sim Não prédefinido
Dependente de idioma Não Não
OutputIDs de tokens ou subpalavras stringsIDs de tokens
Modelos típicosLLaMA T5 mT5 MistralGPT3 GPT4 Codex
 Exemplo de arquivos usados
Arquivo geradoPara quê serve
modelomodelTokenizador treinado binário
modelovocabDicionário de tokens legível
 Curiosidades
SentencePiece pode tokenizar textos sem espaço ex japonês chinês
Usa estratégias como Unigram Language Model ou BPE Byte Pair Encoding
Pode ser treinado com
spm_train inputdatatxt model_prefixmymodel vocab_size8000 model_typebpe
Se quiser posso