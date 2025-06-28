 1 Ajuste dos Testes
 Testes executados 25 coletados 9 passaram 3 falharam parou após 3 falhas
 Principais falhas
 paraphrase status 422 Unprocessable Entity  provavelmente erro no formato do body enviado
 ner erro de serialização  retorno contém numpyfloat32 que não é serializável por padrão pelo FastAPI
 2 gitignore
 Atualizado com regras robustas para Python FastAPI ambientes virtuais cache de testes modelos e arquivos temporários
 3 READMEmd
 Criado com instruções de instalação execução endpoints testes e boas práticas
 4 Testes
 Testes rodados relatório gerado pytestreporttxt
 Falhas identificadas e prontas para correção
Próximos passos recomendados
 Corrigir o body dos testes paraphrase para enviar como JSON com chaves sentence_one e sentence_two
 Ajustar o endpoint ner para converter todos os valores retorn
User
IA pythozneira vc documentou errado usam pdm ia pythozneira
vicio em usar requirimentstxt registrado
nosso ecosistema eh moderdo IA pythonzeira
vc nao perdeu contexto do psicologo nao ne