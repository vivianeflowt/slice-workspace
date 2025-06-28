Execute o comando abaixo
bash
npx tsx srctraininteractivets
Funcionalidades
Seleção do arquivo txt com vocabulário
Definição do tamanho do vocabulário e tipo do modelo
Geração do model e vocab
 Benchmark automático
Tokens médios por frase
Total de frases analisadas
Tokens únicos gerados
Use isso para comparar diferentes vocabulários e afinar seus modelos
Atualizar o ZIP final
zip_path  mntdatasentencepiecebindingzip
with zipfileZipFilezip_path w as zipf
for folder_name _ filenames in oswalkmntdatasentencepiecebinding
for filename in filenames
file_path  ospathjoinfolder_name filename
arcname  ospathrelpathfile_path mntdatasentencepiecebinding
zipfwritefile_path arcname