 Entendido O início do projeto ERD será focado em três pontos essenciais
1 Arquivo de configuração central
 Hardcoded contendo todos os parâmetros necessários para rodar ex URL do servidor caminhos de entradasaída opções de chunking etc
 Exemplo configts ou configjson
2 Arquivo de execução principal
 Um único arquivo ex maints ou clits que lê a configuração executa o fluxo principal e permite rodar o processo repetidas vezes para ajustes e avaliação dos resultados
3 Pasta de utilitários
 Diretório utils com funções utilitárias já preparadas para uso imediato no fluxo principal ex leituraescrita de arquivos chamadas HTTP chunking agrupamento etc
Esses três elementos serão a base inicial garantindo agilidade para experimentar ajustar e evoluir o projeto
User
usa main mesmo
Cursor
 O arquivo principal de execução será maints responsável por ler a configuração executar o fluxo e permitir rodar o processo quantas vezes for necessário para ajustes e avaliação
User