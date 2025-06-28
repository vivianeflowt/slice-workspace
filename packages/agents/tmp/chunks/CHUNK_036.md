 detokenizeids number modelPath string string
Reconstrói o texto original a partir dos tokens
  CLI Otimizador de Prompt
 Uso
bash
npx tsx srcclits modelsllamamodel meu_prompttxt
Conta tokens
Remove linhas inúteis ou excessivamente longas
Salva uma versão otimizada do prompt
 Suporte a múltiplos modelos
Basta passar o caminho do model desejado como argumento para as funções tokenize detokenize ou para o CLI
Atualizar o ZIP final
zip_path  mntdatasentencepiecebindingzip
with zipfileZipFilezip_path w as zipf
for folder_name _ filenames in oswalkmntdatasentencepiecebinding
for filename in filenames
file_path  ospathjoinfolder_name filename
arcname  ospathrelpathfile_path mntdatasentencepiecebinding
zipfwritefile_path arcname
zip_path