 Para evitar bloquear seus comandos CtrlC CtrlV etc enquanto usa a ferramenta o ideal é não depender do clipboard do sistema para enviar o texto ao chat O uso do clipboard é um hack porque o xdotool type não lida bem com textos grandesmultilinhas mas ele interfere no seu fluxo normal de copiarcolar
Soluções possíveis sem bloquear comandos
1 Simular digitação linha a linha sem clipboard
 Em vez de usar o clipboard o worker pode dividir o texto em linhas e usar xdotool type para cada linha seguido de xdotool key ShiftReturn para nova linha e só no final um Return simples
 Isso preserva a formatação e não mexe no clipboard mas pode ser um pouco mais lento
2 Usar um buffer temporário xselxclip isolado
 Em vez de sobrescrever o clipboard principal usar o primary selection do X11 xsel input primary e colar com o botão do meio do mouse xdotool click 2 sem afetar o clipboard padrão
 Só funciona em ambientes X11 não Wayland
3 Permitir escolha do modo no app
 Adicionar uma opçãoconfiguração para o usuário escolher entre modo seguro não mexe no clipboard mas digita linha a linha e modo rápido usa clipboard mas pode sobrescrever temporariamente
Minha sugestão
Implementar o modo simular digitação linha a linha como padrão pois é o mais seguro e não interfere no seu fluxo de comandos
Posso aplicar essa solução agora Confirma
User
Simular digitação linha a linha sem clipboard
deu bug por isso ao voltar ao usar o clipboar ele enviou certo
Cursor