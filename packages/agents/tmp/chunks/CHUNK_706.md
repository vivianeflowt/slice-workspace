Perfeito seu diagnóstico está correto quando o worker usava apenas xdotool type para textos grandesmultilinhas ele bugava perdia linhas travava ou não enviava tudo Por isso ao voltar para o clipboard o envio ficou correto  mas com o efeito colateral de interferir no seu CtrlCCtrlV
Resumo
 xdotool type é confiável só para textos curtos e sem muitas quebras de linha
 Clipboard funciona para qualquer texto mas atrapalha o fluxo do usuário
Solução avançada para LinuxX11
 Usar o primary selection xsel primary para colar sem mexer no clipboard principal
 Ou se for Wayland buscar uma alternativa como wlclipboard mas nem todo app suporta
Próximos passos sugeridos
1 Adicionar uma configuração no app para escolher o modo de envio clipboard padrão primary selection ou digitação linha a linha
2 Detectar o ambiente X11Wayland e sugerir o método mais seguro
3 Documentar no app Modo clipboard pode interferir no CtrlCCtrlV Use modo seguro se isso for um problema
Se quiser posso implementar a opção de modo de envio e detecção automática do ambiente Confirma
User
como busco isso
Cursor
 Para buscar e alternar entre métodos de envio clipboard primary selection digitação linha a linha você pode
 1 Detectar o ambiente gráfico X11 ou Wayland
No terminal
bash
echo XDG_SESSION_TYPE
 Se retornar x11 você pode usar xsel ou xclip para manipular o primary selection
 Se retornar wayland o recomendado é wlcopywlpaste wlclipboard