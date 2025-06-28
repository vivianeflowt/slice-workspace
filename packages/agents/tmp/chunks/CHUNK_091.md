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
 2 Verificar se tem xselxclipwlclipboard instalados
No terminal
bash
which xsel
which xclip
which wlcopy
Se algum deles retornar um caminho está instalado
 3 Testar o primary selection X11
No terminal
bash
echo teste primary  xsel input primary
 Agora clique com o botão do meio do mouse em qualquer campo de texto para colar
Isso não afeta o CtrlCCtrlV do clipboard principal
shellscript
echo XDG_SESSION_TYPE
shellscript
which xsel
which xclip
which wlcopy