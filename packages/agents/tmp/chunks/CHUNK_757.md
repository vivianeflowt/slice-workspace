 Estilo funcional
 Sempre priorizar lodashfp para manipulação de dados
 Evitar mutação de objetosarrays preferir funções puras
 Composição de funções para pipelines de processamento
 Estrutura modular
 Separar lógica de negócio CLI utilitários e integrações
 Centralizar configurações em config
 Logs e experimentos
 Todos os experimentos devem ser registrados em logs
 Logging estruturado winstonpino e colorido colorette
 Testes
 Todos os módulos devem ter cobertura de testes com Vitest
 Testes em tests e exemplos reais em examples
 Documentação
 Manter PROJECTmd e GUIDELINEmd sempre atualizados
 Documentar experimentos prompts parâmetros e resultados
 4 Convenções
 Nomenclatura
 Funções camelCase
 Classes PascalCase
 Constantes UPPER_SNAKE_CASE
 Importação
 Sempre usar imports explícitos de lodashfp import  map filter  from lodashfp
 Configuração
 Variáveis sensíveis e parâmetros em env ou config
 CLI
 Todos os comandos devem ser documentados com exemplos de uso
 5 Fluxo de Desenvolvimento
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