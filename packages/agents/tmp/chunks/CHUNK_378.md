Seria a fase de curadoria do dataset de treino
backup separei original aqui
vc pode ja criar o pre processamento e preprocessar
Mas outra dica nao jutnar os dataset
Porque sao contextos diferentes em dias diferentes
Entao tem que treinar em camada
Cursor
Dica excelente Isso mostra maturidade de engenharia de dados e respeito ao contexto incremental
 Resumo das melhores práticas para o préprocessamento do ALIVE
1 Separar falas do usuário e da IA
 Só os prompts do usuário devem ser usados para treinar o protocolo de compressãointerpretador
 Respostas da IA devem ser ignoradas ou se necessário processadas separadamente para outros fins ex análise de feedback
2 Não juntar todos os datasets
 Cada arquivo chat01md chat02md etc representa um contexto sessão ou dia diferente
 Treinar em camadas permite capturar evolução mudanças de estilo adaptação ao longo do tempo e evita misturar contextos que não se comunicam
3 Curadoria incremental
 O pipeline deve ser capaz de treinar avaliar e versionar modelospadrões por sessão e só depois se fizer sentido criar um modelo global ou transfer learning