Se quiser posso sugerir prompts específicos para cada modeloetapa ou gerar um script inicial de segmentação e sumarização usando esses modelos
Deseja avançar com um exemplo prático de script ou prefere definir primeiro o formato do dataset de entrada
User
fiquei agora com duvida se o chat tem dados de imagem acho que nao
Cursor
Sua dúvida faz sentido normalmente datasets de chat especialmente logs de conversas datasets de benchmark de IA conversacional etc não incluem dados de imagem  são compostos apenas por texto mensagens metadados timestamps etc
Cenários típicos de datasets de chat
 Mensagens de texto usuárioIA
 Metadados quem falou timestamp id da sessão
 Às vezes anotações de sentimento tópicos etc
 Raramente links emojis ou referências a imagens mas não a imagem em si
Quando usar modelos multimodais
 Se o dataset explicitamente trouxer imagens screenshots ou mensagens do tipo imagem enviada com o arquivo embutido
 Se houver campos como image_url image_data ou anotações visuais
Como confirmar
 Basta inspecionar um trecho do dataset ou o schema e verificar se há campos de imagem
 Se quiser posso analisar um exemplo do seu dataset para confirmar
Resumo objetivo
Se o seu dataset de chat não tem campos de imagem não precisa usar modelos multimodais como llava ou granitevision
Foque nos modelos de texto LLMs e embeddings para segmentação sumarização e curadoria
Se quiser envie um exemplo de entrada do dataset para eu validar e sugerir o pipeline mais enxuto possível