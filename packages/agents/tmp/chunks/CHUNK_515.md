 Exemplo de uso
python
from transformers import AutoTokenizer AutoModel
model_name  unicampdlmMiniLML6v2enptmsmarcov2
tokenizer  AutoTokenizerfrom_pretrainedmodel_name
model  AutoModelfrom_pretrainedmodel_name
 Quando escolher este modelo
 Se seu pipeline lida com textos em português e inglês ou pode vir a lidar ele é mais versátil que o modelo sópt
 Para aplicações de busca QA RAG clusterização e deduplicação em ambientes multilíngues
 Se quiser interoperabilidade com outros sistemas internacionais ex comparar perguntasrespostas em ambos idiomas
 Referência
 unicampdlmMiniLML6v2enptmsmarcov2 na Hugging FacehttpshuggingfacecounicampdlmMiniLML6v2enptmsmarcov2
Resumo
Se o seu ecossistema pode receber dados em inglês e português ou se você quer máxima flexibilidade para NLP bilíngue esse modelo é uma escolha excelente
Se quiser posso sugerir benchmarks ou formas de comparar a performance dele com os outros modelos da UNICAMP para o seu caso de uso
python
from transformers import AutoTokenizer AutoModel
model_name  unicampdlmMiniLML6v2enptmsmarcov2
tokenizer  AutoTokenizerfrom_pretrainedmodel_name
model  AutoModelfrom_pretrainedmodel_name
User