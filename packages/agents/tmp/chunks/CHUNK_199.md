plaintext
 Conceito do diretório base
 Este diretório contém a base das classes abstratas e interfaces gerais do ecossistema Slice
 Serve para definir contratos padrões e compatibilidade entre diferentes partes da aplicação incluindo mas não se limitando a providers de IA
 Exemplos BaseAIProvider interfaces de serviços contratos de dados middlewares genéricos etc
 Todo provider de IA serviço ou componente compartilhado deve herdar ou implementar as abstrações aqui definidas para garantir integração e evolução consistente
 Use este template como referência para os cursorrules de cada base abstrata ou interface compartilhada
User
cursorules aqui já você deveria definir que essa fichares devem tentar seguir o máximo a o como funciona a OpenAI sacou mas sem usar o estacionamento aqui já você deveria definir que essa fichares devem tentar seguir o máximo a o como funciona a Open sacou mas sem usar o estacionamento e aqui já você deveria definir que essa fichares devem tentar seguir o máximo a o como funciona a Open sacou mas sem usar o estacionamento e adaptações no que fizesse sentido
Cursor
plaintext
 Conceito do diretório features
 As features deste diretório devem sempre que possível seguir o padrão de design interface e organização da OpenAI priorizando compatibilidade e facilidade de integração com APIs e fluxos similares
 Não utilize dependências diretas ou acoplamento com a OpenAI adapte e evolua as implementações conforme necessário para o contexto do ecossistema Slice
 O objetivo é garantir flexibilidade portabilidade e facilidade de manutenção permitindo migrar ou expandir funcionalidades para outros provedores ou serviços no futuro
User
cursorrules aqui você deveria dizer que as constantes ficam todas as constantes do sistema e as constantes devem ser agrupadas por por contexto e categoria delas e comentadas tem um comentário entre cada uma e o contexto delas
Cursor