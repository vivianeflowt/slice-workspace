stdvectorint ids
for uint32_t i  0 i  inputArrayLength i 
idspush_backinputArrayGetiAsNapiNumberInt32Value
sentencepieceSentencePieceProcessor sp
spLoadmodel_path
stdstring result
spDecodeids result
return NapiStringNewenv result
 Atualizar Init para incluir decode
with opencpp_path r as f
content  fread
updated_content  contentreplace
exportsSetencode NapiFunctionNewenv Encode
exportsSetencode NapiFunctionNewenv Encode
exportsSetdecode NapiFunctionNewenv Decode
fseek0
fwriteupdated_content
ftruncate
 Atualizar indexts e indexdts
index_ts  mntdatasentencepiecebindingsrcindexts
index_dts  mntdatasentencepiecebindingsrcindexdts
with openindex_ts w as f
fwrite
const native  requirebuildReleasesentencepiece_native
export function tokenizetext string modelPath string number 
return nativeencodetext modelPath
export function detokenizeids number modelPath string string 
return nativedecodemodelPath ids
with openindex_dts w as f
fwrite
export function tokenizetext string modelPath string number
export function detokenizeids number modelPath string string