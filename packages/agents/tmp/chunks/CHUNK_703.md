Cursor
 Perfeito obrigado pelo retorno Se voltar ao estado
User
mas demora mt
Cursor
 Entendido O botão ENVIANDO está demorando para voltar ao normal após o envio Isso indica que o frontend só libera o botão quando recebe a resposta do backend
Se o envio via xdotoolclipboard for lento por causa do subprocesso Python o usuário fica esperando
Melhorias possíveis
 Exibir um loading mais discreto mas liberar o botão logo após o envio da requisição otimista
 Ou mostrar um aviso de envio em processamento e permitir novo envio sem travar a interface
 Ou mover o envio para um workerqueue no backend e responder imediatamente ao frontend
Se quiser posso implementar o modo otimista o botão volta ao normal logo após o POST sem esperar o subprocesso terminar Confirme se deseja essa abordagem ou outra
User