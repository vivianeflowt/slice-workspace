1 Implementar funcionalidades em módulos pequenos e testáveis
2 Escrever testes automatizados para cada módulo
3 Registrar experimentos e aprendizados em logs e documentação
4 Validar idempotência e robustez das funções de organização
5 Refatorar e documentar continuamente
 Este guideline deve ser revisado e expandido conforme o projeto evoluir e novas necessidades surgirem
 GUIDELINEmd criado com todas as definições de bibliotecas padrões técnicos estrutura de diretórios estilo funcional lodashfp uso de colorette vitest e orientações detalhadas para o projeto ERD
Pronto para sua avaliação e validação
User
variaveis vc em dotenv ignore deixa hardcoed por enquanto a base url do server princial
Cursor
 Variáveis sensíveis e de ambiente como base URL do servidor principal ficarão hardcoded no início do projeto sem uso de dotenvconfig externo neste momento
Quando necessário a migração para dotenvconfig será feita mas por ora a base URL e parâmetros principais estarão diretamente no código para facilitar setup e testes iniciais
User
ora nao funcona em commonjs