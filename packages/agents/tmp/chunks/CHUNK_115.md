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
 Automações
 Scripts para geração de diagramas ERD a partir deste arquivo
 Validação automática de integridade e consistência do modelo
 Integração com pipelines de CICD para garantir atualização da documentação
 Histórico de Mudanças
 v100 Criação inicial do PROJECTmd e definição dos requisitos básicos
 Este arquivo deve ser atualizado sempre que houver decisões mudanças ou novos requisitos no pacote ERD