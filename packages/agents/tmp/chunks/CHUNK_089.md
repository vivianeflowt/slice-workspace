Ajuste a seguir
typescriptreact
  existing code 
const handleSend  async   
setSuccessfalse
const behaviorObj  BEHAVIORSfindb  bkey  behavior
const finalText 
behavior  GENERIC  behaviorObjcontent
 inputnnnbehaviorObjcontentn
 input
 Dispara a requisição mas não espera o await para liberar o botão
request method POST body  text finalText  
then  setSuccesstrue
catch  setSuccessfalse
  existing code 
 Ajuste feito agora o botão de envio é liberado imediatamente após o clique permitindo múltiplos envios em sequência sem travar a interface Pode testar
User
ve se vc consegue pensar em um jeito de nao bloquear meus comandos ao usar a ferramenta o que tenho que ficar fazendo é desligando e ligando
Cursor
 Para evitar bloquear seus comandos CtrlC CtrlV etc enquanto usa a ferramenta o ideal é não depender do clipboard do sistema para enviar o texto ao chat O uso do clipboard é um hack porque o xdotool type não lida bem com textos grandesmultilinhas mas ele interfere no seu fluxo normal de copiarcolar
Soluções possíveis sem bloquear comandos
1 Simular digitação linha a linha sem clipboard
 Em vez de usar o clipboard o worker pode dividir o texto em linhas e usar xdotool type para cada linha seguido de xdotool key ShiftReturn para nova linha e só no final um Return simples
 Isso preserva a formatação e não mexe no clipboard mas pode ser um pouco mais lento
2 Usar um buffer temporário xselxclip isolado
 Em vez de sobrescrever o clipboard principal usar o primary selection do X11 xsel input primary e colar com o botão do meio do mouse xdotool click 2 sem afetar o clipboard padrão
 Só funciona em ambientes X11 não Wayland