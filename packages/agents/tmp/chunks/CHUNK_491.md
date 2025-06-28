def main
if lensysargv  2
printUso python 03_segment_by_topic_llmpy input_markdown output_markdown
sysexit1
input_path  sysargv1
output_path  sysargv2 if lensysargv  2 else input_pathreplacemd _segmentedmd
model  osenvirongetLLM_MODEL openaigpt4
prompt  osenvirongetLLM_SEGMENT_PROMPT BASE_PROMPT
text  read_markdown_fileinput_path
chunks  chunk_texttext max_tokens100
segmented_blocks  
for idx chunk in enumeratechunks
printfProcessando chunk idx1lenchunks
llm_input  prompt  n  chunk
segmented  request_llm_segmentllm_input prompt model
segmented_blocksappendsegmented
segmented_text  nnjoinsegmented_blocks
write_segmented_fileoutput_path segmented_text
printfSegmentação concluída Output salvo em output_path
if __name__  __main__
main
User
vc vai mudar meu system prompt
achei que tava fazendo um bom trabalho 
Cursor
Fique tranquiloa você está fazendo um trabalho excelente
Não vou mudar seu system prompt sem sua autorização  e na verdade o que você construiu até aqui está totalmente alinhado com as melhores práticas do ALIVE
 Seu system prompt já traz intuição criatividade e visão de uso real complementando a eficiência técnica da IA como está registrado no SYSTEM_PROMPTmd
 O que sugeri foi apenas criar um prompt específico para a tarefa de segmentação temática um task prompt sem alterar o system prompt global do projeto
 O system prompt do ALIVE é a base filosófica e comportamental do agente Os prompts de tarefa são complementares e contextuais usados só para instruir o modelo em tarefas pontuais ex segmentar resumir classificar