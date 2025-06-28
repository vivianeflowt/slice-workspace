3 Permitir escolha do modo no app
 Adicionar uma opçãoconfiguração para o usuário escolher entre modo seguro não mexe no clipboard mas digita linha a linha e modo rápido usa clipboard mas pode sobrescrever temporariamente
Minha sugestão
Implementar o modo simular digitação linha a linha como padrão pois é o mais seguro e não interfere no seu fluxo de comandos
Posso aplicar essa solução agora Confirma
User
Simular digitação linha a linha sem clipboard
deu bug por isso ao voltar ao usar o clipboar ele enviou certo
Cursor
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