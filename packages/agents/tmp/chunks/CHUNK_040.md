Você pode treinar seu próprio modelo model com base no seu vocabulário usando
bash
npx tsx srctraints datameuvocabulariotxt vocab_size 8000 model_type bpe model_prefix modelsmeumodelo
Argumentos disponíveis
vocab_size  tamanho do vocabulário ex 8000 16000
model_type  tipo bpe unigram char word
model_prefix  prefixo dos arquivos gerados model vocab
Exemplo de saída
Sempre exibir os detalhes
modelsmeumodelomodel
modelsmeumodelovocab
Esse modelo pode ser usado nas funções tokenize detokenize e na CLI
Atualizar zip final
zip_path  mntdatasentencepiecebindingzip
with zipfileZipFilezip_path w as zipf
for folder_name _ filenames in oswalkmntdatasentencepiecebinding
for filename in filenames
file_path  ospathjoinfolder_name filename
arcname  ospathrelpathfile_path mntdatasentencepiecebinding
zipfwritefile_path arcname
zip_path
Sempre exibir os detalhes
Resultado
mntdatasentencepiecebindingzip
Pronto O projeto agora tem suporte completo para treinar seu próprio vocabulário com SentencePiece