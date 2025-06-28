Cursor
typescript
 Roteador para completions recebe um prompt e retorna resposta da IA
 Segue padrão OpenAI POST completions
import  Router  from express
import  ChatController  from controller
import  asyncHandler  from utilsasynchandler
const chatController  new ChatController
const chatRouter  Router
chatRouterpostcompletions asyncHandlerchatControllerchatbindchatController
export default chatRouter
Router ajustado para usar ChatController e método chat conforme o novo padrão
User
ode aplicar