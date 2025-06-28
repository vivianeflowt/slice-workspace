3 Output para Validação
 Para cada assunto detectado gerar um arquivo markdown separado ex assunto_01md assunto_02md 
 Cada arquivo contém na ordem original os blocosmensagens daquele assunto preservando formatação e metadados relevantes
4 Validação
 Você lê os arquivos markdown e valida se a separação faz sentido
 Feedback pode ser usado para ajustar heurísticas ou treinar modelos
 Exemplo de Output Markdown
assunto_01md
User Oi tudo bem
IA Tudo sim Como posso ajudar
assunto_02md
User Quero saber sobre tokenização
IA Claro Tokenização é o processo de
 Próximos Passos
 Implementar o pipeline acima
 Gerar arquivos markdown para cada assunto
 Opcional Adicionar um índicerelatório com resumo dos assuntos detectados
Confirma esse formato Quer algum detalhe extra nos arquivos markdown ex timestamps separadores visuais etc
Se quiser já posso começar a implementar o préprocessador e o separador sequencial