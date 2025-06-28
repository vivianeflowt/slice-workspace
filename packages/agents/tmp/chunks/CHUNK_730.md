Pronto para anotar requisitos decisões fluxos ou qualquer informação relevante diretamente no arquivo de referência do projeto
Pode detalhar o que deseja registrar
User
Então agora você deve criar o arquivo Project MD nessa pasta que é onde a gente define esse ecossistema nosso O que que a aplicação deve ter para a gente não esquecer
Tudo que for detalhado enquanto este behavior estiver ativo deve ser registrado fielmente no PROJECTmd
Cursor
markdown
 PROJECTmd  Pacote ERD
 Objetivo
Registrar organizar e automatizar a modelagem de entidades e relacionamentos ERD do ecossistema Slice facilitando a documentação visualização e evolução dos modelos de dados
 Contexto
Este pacote faz parte do ecossistema Slice e tem como foco centralizar e padronizar a definição de entidades relacionamentos atributos e regras de negócio servindo como referência para desenvolvedores arquitetos e automações
 Requisitos
 Permitir definição clara de entidades atributos e relacionamentos
 Suportar geração automática de diagramas ERD
 Facilitar integração com outros pacotes do Slice ex admin agents infra
 Permitir versionamento e rastreabilidade de mudanças no modelo de dados
 Suportar anotações de regras de negócio e restrições
 Ser facilmente editável e legível por humanos e ferramentas
 Decisões
 O arquivo PROJECTmd é a fonte de verdade para o modelo ERD deste pacote
 Toda alteração relevante deve ser registrada neste arquivo com histórico de mudanças
 O formato deve ser compatível com ferramentas de geração de diagramas e automação