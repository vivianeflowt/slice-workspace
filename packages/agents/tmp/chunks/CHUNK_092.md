shellscript
echo teste primary  xsel input primary
 Agora clique com o botão do meio do mouse em qualquer campo de texto para colar
User
to usando ultima versar do pop os
faz os diagnosticos pra mim
Cursor
Diagnóstico realizado
 Seu ambiente gráfico é X11
 O utilitário xsel não está instalado
 Não foi detectado xclip nem wlcopy o comando parou no xsel not found
Recomendações
 Para usar o método primary selection colar com botão do meio sem afetar o clipboard instale o xsel
bash
sudo apt install xsel
 Se quiser testar também com xclip
bash
sudo apt install xclip
 O método atual clipboard padrão funciona mas interfere no CtrlCCtrlV
Se quiser posso automatizar a instalação do xsel e ajustar o worker para usar o primary selection evitando interferir no seu clipboard principal Confirma
shellscript
sudo apt install xsel