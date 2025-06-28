 O que entendi do desafio
 Você tem arquivos de documentaçãorequisitos grandes caóticos com conteúdo misturado IA humano chat brainstorm revisões etc
 O objetivo é automatizar a organização sumarização agrupamento e padronização desses arquivos tornandoos claros navegáveis e rastreáveis
 O fluxo deve ser CLI linha de comando sem interface gráfica usando TypeScript commander e se necessário inquirer
 O sistema deve ser plugável com engines de IA já disponíveis no seu servidor Ollama DeepSeek Perplexity etc mas flexível para integrar novas opções
 O processo é experimental não existe uma receita pronta então será feito por tentativa erro registro de experimentos e evolução contínua
 O usuáriohumano entra no processo para validar se o resultado final está coerente mas a IA deve ser autônoma para rodar ajustar e repetir experimentos
 Todo o racional decisões experimentos e aprendizados devem ser registrados no PROJECTmd
 Passos que devo seguir
1 Estruturar o projeto em TypeScript
 Criar CLI com commander
 Centralizar configurações em um arquivo único
 Preparar funções utilitárias para dividir agrupar sumarizar e detectar contradições
2 Integrar engines de IA
 Preparar funções para consumir os modelos disponíveis via HTTP axios
 Permitir fácil troca de modelopromptparâmetro
3 Implementar fluxo de experimentação
 Cada execução gera um logarquivo de experimento com parâmetros prompt resultado e observações
 Permitir rodar o script várias vezes refinando o arquivo a cada rodada
4 Gerar dois resultados principais
 Um arquivo final organizado centralizando ideias e decisões
 Um logrelatório de experimentos para rastreabilidade
5 Permitir ajustes pontuais
 O usuário pode pedir para reorganizar só um trecho corrigir uma seção etc
6 Registrar tudo no PROJECTmd
 Manter o racional desafios decisões e evolução do projeto sempre documentados
7 Colaborar com o usuário
 A IA automatiza e experimenta o humano valida e orienta ajustes de alto nível