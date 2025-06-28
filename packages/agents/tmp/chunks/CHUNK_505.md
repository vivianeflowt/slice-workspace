2 Outputs versionados
 Só versione os arquivos de resultado segmentação sentimento agrupamento no repositório principal
 Documente sempre os parâmetrosmodelos usados
3 Documentação clara
 No CONTECTmd registre
 Modelos usados links Hugging Face versões
 Parâmetros principais
 Datahora da execução
 Observações sobre performanceresultados
Resumo
 O pipeline de curadoria pode e deve ser modular externo e facilmente reexecutável
 O repositório principal fica limpo leve e rastreável
 Você ganha flexibilidade máxima para evoluir experimentar e validar
Se quiser posso sugerir a estrutura de pastasscriptsnotebooks para organizar esse fluxo externo
User
mediadatallvmprompt
gitignore aqui
cria um projeto que vc instancia eles e fornece um endpoint http
Cursor
Perfeito Você quer um projeto simples fora do repositório principal que