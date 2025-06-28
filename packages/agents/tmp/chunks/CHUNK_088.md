Cursor
 Entendido O botão ENVIANDO está demorando para voltar ao normal após o envio Isso indica que o frontend só libera o botão quando recebe a resposta do backend
Se o envio via xdotoolclipboard for lento por causa do subprocesso Python o usuário fica esperando
Melhorias possíveis
 Exibir um loading mais discreto mas liberar o botão logo após o envio da requisição otimista
 Ou mostrar um aviso de envio em processamento e permitir novo envio sem travar a interface
 Ou mover o envio para um workerqueue no backend e responder imediatamente ao frontend
Se quiser posso implementar o modo otimista o botão volta ao normal logo após o POST sem esperar o subprocesso terminar Confirme se deseja essa abordagem ou outra
User
deve meio que poder te enviar varias em seguida
Cursor
 Entendido O ideal é permitir envios múltiplos em sequência sem travar o botão ou a interface enquanto o backend processa
Vou ajustar o frontend para
 Liberar o botão imediatamente após o envio da requisição modo otimista
 Permitir que o usuário envie várias mensagens seguidas sem precisar esperar o backend responder