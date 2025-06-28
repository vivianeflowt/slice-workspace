 1 Desabilitar o formatador automático
 Vá em File  Preferences  Settings ou pressione Ctrl
 Pesquise por format on save
 Desmarque a opção Editor Format On Save
 Se quiser desabilitar só para TypeScriptJavaScript
 Pesquise por default formatter
 Em Editor Default Formatter selecione none ou outro formatador de sua preferência
 2 Desabilitar extensões específicas
 Abra o painel de extensões CtrlShiftX
 Procure por extensões de formatação ex Prettier ESLint TypeScript and JavaScript Language Features
 Desabilite ou configure para não rodar automaticamente
 3 Desabilitar participantes de arquivo
 Pesquise nas configurações por filesparticipants
 Você pode desabilitar File Delete Participants ou Format On Save Participants se não quiser que rodem ao deletarsalvar arquivos
 4 settingsjson direto
Adicione ao seu vscodesettingsjson
json
editorformatOnSave false
editorformatOnType false
typescript  editorformatOnSave false 
javascript  editorformatOnSave false 
Se quiser apenas ocultar o popup normalmente ele some sozinho mas desabilitar o formatador automático resolve de vez
Se precisar de um passo a passo para sua IDE específica ou quer manter o formatador mas sem popup me avise
json
editorformatOnSave false
editorformatOnType false
typescript  editorformatOnSave false 
javascript  editorformatOnSave false 
User
pode criar pra mim
Cursor