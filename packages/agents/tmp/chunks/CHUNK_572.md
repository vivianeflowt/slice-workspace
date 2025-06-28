 O mesmo vale para sentence_transformers se não estiver listado no pyprojecttomlpdmlock
Causas prováveis
 O ambiente virtual correto não está ativado
 O PDM não instalou as dependências no ambiente usado pelo makepython
 O pacote não está listado nas dependências do projeto
 Ação recomendada checklist rápido
1 Confirme o ambiente Python
 Rode which python3 e which pip dentro do terminal
 Rode python3 m pip list  grep transformers para ver se está instalado no ambiente certo
2 Garanta dependências no pyprojecttoml
 Adicione se faltar
transformers
sentencetransformers
 Rode
pdm add transformers sentencetransformers
pdm install
3 Reexecute
 Rode novamente
make downloadmodels
Se quiser posso automatizar a checagem e o ajuste do pyprojecttoml para garantir que nada falte
Sinalize se quer que eu rodeadapte esses comandos ou se prefere seguir manualmente
Resumo
Sem dependência instalada no ambiente certo não tem IA pythonzeira funcional nem download de modelo
Ambiente dependência automação  nessa ordem
plaintext
ModuleNotFoundError No module named transformers
plaintext
transformers
sentencetransformers