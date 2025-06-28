stdvectorint ids
spEncodeinput ids
NapiArray result  NapiArrayNewenv idssize
for size_t i  0 i  idssize i 
resultSeti NapiNumberNewenv idsi
return result
NapiObject InitNapiEnv env NapiObject exports 
exportsSetencode NapiFunctionNewenv Encode
return exports
NODE_API_MODULEsentencepiece_native Init
ospathjoinsrc_dir indexts 
import  encode  from buildReleasesentencepiece_native
export function tokenizetext string modelPath string number 
return encodetext modelPath
ospathjoinsrc_dir indexdts 
export function tokenizetext string modelPath string number
 Escrever arquivos no sistema
for path content in filesitems
with openpath w as f
fwritecontentstrip
 Compactar o projeto
zip_path  mntdatasentencepiecebindingzip
with zipfileZipFilezip_path w as zipf
for folder_name _ filenames in oswalkproject_root
for filename in filenames
file_path  ospathjoinfolder_name filename
arcname  ospathrelpathfile_path project_root
zipfwritefile_path arcname
zip_path
Resultado
mntdatasentencepiecebindingzip
Aqui está o projeto completo com binding nativo em TypeScript para libsentencepiece com tipagem forte e pronto para extensão
 Download do projeto zip