 Testes
Execute todos os testes com
bash
pytest
Os testes cobrem endpoints integração e funções principais
 Boas práticas
 Sempre rode scripts e salve outputs neste diretório
 Não versionar modelos outputs ou arquivos temporários
 Consulte gitignore para manter o repositório limpo
 Estrutura
 server  Código principal da API
 tests  Testes de endpoints
 server__tests__  Testes de integração e unidade
 Observações
 Modelos são baixados automaticamente na primeira execução
 Para baixar manualmente execute
bash
python serverdownload_modelspy
Dúvidas Consulte o time ou abra uma issue
Execução concluída como tech lead pythonzeira