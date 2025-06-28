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
shellscript
sudo apt install xclip
User
instalado
Cursor
 O xsel está instalado Agora posso ajustar o worker para usar o primary selection do X11 colando o texto com o botão do meio do mouse sem afetar seu CtrlCCtrlV
Vou aplicar essa melhoria agora