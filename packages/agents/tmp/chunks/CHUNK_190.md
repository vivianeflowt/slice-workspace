DeepSeekProviderts ajuste ele
vc sabe corrigir esse erro chato da IDE tudo que mecho aparece isso
denovo olha
Cursor
Esse popup Running TypeScript and JavaScript Language Features Formatter aparece porque o VS Code ou sua IDE baseada nele está rodando o formatador padrão do TypeScriptJavaScript automaticamente ao salvar editar ou manipular arquivos
 Como resolver ou desabilitar
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