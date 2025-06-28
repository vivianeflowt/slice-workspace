python
import sentencepiece as spm
 Carregar modelo treinado
sp  spmSentencePieceProcessor
sploadmeu_modelomodel
 Tokenizar texto
tokens  spencodeSeu texto aqui out_typestr
ids  spencodeSeu texto aqui out_typeint
 Detokenizar
texto_original  spdecodeids
 Referências
 README oficial SentencePiecehttpsgithubcomgooglesentencepieceblobmasterREADMEmd
 Exemplo de treinamento e usohttpsgithubcomgooglesentencepiecetrainsentencepiecemodel
 API Pythonhttpsgithubcomgooglesentencepiecepythonmodule
Se quiser posso já criar o script de treinamento e extração de padrões integrando SentencePiece ao pipeline do protocolo visualcontextual e gerar o JSON para servir de interpretador dos seus prompts
Só confirmar o nome do arquivo do dataset e o prefixo desejado para o modelo
shellscript
spm_train inputseu_datasettxt model_prefixmeu_modelo vocab_size8000 character_coverage10 model_typeunigram
shellscript
spm_encode modelmeu_modelomodel output_formatpiece  inputtxt  outputtxt
shellscript
spm_encode modelmeu_modelomodel output_formatid  inputtxt  output_idstxt
python
import sentencepiece as spm