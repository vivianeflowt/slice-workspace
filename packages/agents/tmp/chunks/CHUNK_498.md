 Substituir chunk_text por split_in_n_chunks no main
def main
if lensysargv  2
printUso python 03_segment_by_topic_llmpy input_markdown output_markdown
sysexit1
input_path  sysargv1
output_path  sysargv2 if lensysargv  2 else input_pathreplacemd _segmentedmd
model  osenvirongetLLM_MODEL openaigpt4
prompt  osenvirongetLLM_SEGMENT_PROMPT BASE_PROMPT
text  read_markdown_fileinput_path
 Dividir em 3 pedaços iguais
chunks  split_in_n_chunkstext 3
segmented_blocks  
for idx chunk in enumeratechunks
printfProcessando chunk idx13
llm_input  prompt  n  chunk
segmented  request_llm_segmentllm_input prompt model
segmented_blocksappendsegmented
segmented_text  nnjoinsegmented_blocks
write_segmented_fileoutput_path segmented_text
printfSegmentação concluída Output salvo em output_path
if __name__  __main__
main
User
2k de contexto representa o q
to fazendo uma analise aqui
me ajuda nas matematicas
Cursor