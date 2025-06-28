 2 Treinamento do Modelo
Você pode treinar diretamente via Python
python
import sentencepiece as spm
spmSentencePieceTrainertrain
inputseu_datasettxt
model_prefixmeu_modelo
vocab_size8000
character_coverage10
model_typeunigram  ou bpe char word
Isso gera meu_modelomodel e meu_modelovocab
 3 Carregar e Usar o Modelo
python
import sentencepiece as spm
sp  spmSentencePieceProcessor
sploadmeu_modelomodel
 Tokenizar texto
tokens  spencodeSeu texto aqui
shellscript
pip install sentencepiece
shellscript
pdm add sentencepiece
python
import sentencepiece as spm
spmSentencePieceTrainertrain
inputseu_datasettxt
model_prefixmeu_modelo
vocab_size8000
character_coverage10
model_typeunigram  ou bpe char word
python
import sentencepiece as spm