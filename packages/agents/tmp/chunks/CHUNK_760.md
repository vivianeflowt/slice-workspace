Somente após esse fluxo básico estar funcional outras etapas serão consideradas
User
você inicialmente só precisa de três coisas ao meu ver é 3 um arquivo que você parametriza tudo que você precisa para rodar tá por exemplo vocês têm problemas que você vai usar aonde tá o URL do Servidor enfim o que você precisa de parametrizar para fazer as coisas você inicialmente só precisa de três coisas ao meu ver é 3 um arquivo que você parametriza tudo que você precisa para rodar tá por exemplo vocês têm problemas que você vai usar aonde tá o URL do Servidor enfim o que você precisa de parametrizar para fazer as coisas o arquivamento que você vai rodar para executar você inicialmente só precisa de três coisas ao meu ver é 3 um arquivo que você parametriza tudo que você precisa para rodar tá por exemplo vocês têm problemas que você vai usar aonde tá o URL do Servidor enfim o que você precisa de parametrizar para fazer as coisas o arquivamento que você vai rodar para executar e uma pasta útil com as coisas já Preparadas para você utilizar no meio correto
Cursor
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