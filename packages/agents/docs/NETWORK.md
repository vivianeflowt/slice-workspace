# NETWORK.md

# Princípios Fundamentais de Rede (extraído de CONCEPTS.md)

- **Baixo recurso & custo mínimo:** Priorize soluções locais, open source e de baixo custo. Toda decisão de rede deve considerar restrições de hardware e orçamento.
- **/media/data é o espaço de produção:** Todo dado, modelo, asset ou aplicação pronta deve ser armazenado em /media/data. O disco do sistema (root) é apenas para temporários.
- **Automação e plug-and-play:** Módulos de rede (VPN, honeypot, firewall, storage) devem ser plug-and-play, com instalação e restauração automatizadas via Makefile ou scripts equivalentes.
- **Validação forte e padronizada:** Toda configuração, parâmetro e integração de rede deve ser validada por schemas (Zod, JSON Schema), garantindo previsibilidade e segurança.
- **Restauração rápida:** O ambiente de rede deve ser reconstruível do zero, de forma automatizada, confiável e rápida, priorizando serviços essenciais.
- **Documentação padrão:** Cada aspecto da rede (topologia, firewall, VPN, honeypot, storage) deve ter documentação clara, exemplos, anti-padrões e checklist de validação.
- **Encapsulamento e responsabilidade única:** Cada módulo de rede deve ser independente, com função clara e interface oficial, sem vazar detalhes internos.
- **Curadoria de licença:** Ferramentas de rede só podem ser adotadas após análise explícita de licença, garantindo compatibilidade com open source e automação.
- **Validação incremental:** Nenhuma ferramenta, guideline ou automação de rede é padronizada sem validação incremental e registro de aprendizados.

---

## Diagrama da Topologia de Rede Slice/ALIVE

```
[MODEM OPERADORA]
      |
----------------------------- (divisor lógico: rede doméstica / rede de desenvolvimento)
      |
[Omada Gigabit VPN Router (ER605)]
      |
  +---------+---------+
  |                   |
[LOCALCLOUD]     [WORKSTATION]
```

### Descrição
- Modem da operadora: conexão com a internet, entrega IP para o roteador de desenvolvimento.
- Divisão lógica: separa a rede doméstica da rede de desenvolvimento.
- Omada Gigabit VPN Router (ER605): roteador dedicado, isola e protege a rede de desenvolvimento.
- LocalCloud: servidor/cluster local, conectado ao roteador de desenvolvimento.
- Workstation: máquina principal de desenvolvimento, conectada ao roteador.

---

## Especificação das Máquinas de Desenvolvimento

### LOCALCLOUD
- **Hostname:** localcloud
- **IP:** 192.168.100.10
- **CPU:** 2× Intel Xeon E5-2680 v4, 56 threads, 28 núcleos, até 2.4 GHz
- **Arquitetura:** x86_64
- **RAM:** 62 GiB DDR4
- **Disco:**
  - /dev/sda3 (root): 211 GB (17 GB usados)
  - /dev/mapper/vg0-lv--0 (/media/data): 932 GB (18 GB usados)
- **Swap:** 8,0 GiB
- **Sistema Operacional:** Ubuntu 25.04
- **GPU:** AMD Radeon RX 580 2048SP (Polaris 20 XL), 8 GB VRAM
- **Função:** Servidor local para experimentos, automação, armazenamento, etc.
- **Observações:** Diagnóstico via SSH, usuário ubuntu. Driver amdgpu. 2 pacotes pendentes de atualização. IP público: 179.210.51.170. DNS: 127.0.0.53. Ping Google: OK.

### WORKSTATION
- **Hostname:** workstation
- **IP:** 192.168.100.100
- **CPU:** 13th Gen Intel(R) Core(TM) i5-13400 (16 threads)
- **RAM:** 64,0 GiB
- **Sistema Operacional:** Pop!_OS 22.04 LTS (64 bits)
- **Placa-mãe:** Gigabyte Z790 AORUS ELITE AX
- **Disco:**
  - /dev/sdb3 (root): 907 GB (95 GB usados, 767 GB livres)
  - /dev/md0 (/media/data): 898 GB (334 GB usados, 519 GB livres)
  - /dev/sda1 (/media/vivi/backup): 932 GB (243 GB usados, 690 GB livres)
  - /dev/sdb1 (/boot/efi): 1 GB (207 MB usados, 814 MB livres)
- **GPU:** NVIDIA GeForce RTX 4060/PCIe/SSE2
- **Função:** Máquina principal de desenvolvimento, automação, testes, etc.
- **Observações:** Storage principal e dados persistentes sempre em /media/data. Backup externo em /media/vivi/backup. GPU dedicada para IA/ML, docker, textgen-webui, isolamento de rede via Omada ER605.

---

## Padrão de Armazenamento Slice/ALIVE

- Em todas as máquinas Slice/ALIVE, o diretório **/media/data** é o padrão para:
  - Modelos de IA, datasets, checkpoints, volumes de containers, resultados de experimentos.
  - Aplicações prontas, módulos, extensões e qualquer asset compartilhado entre agentes ou serviços.
- Scripts, automações e módulos devem sempre usar **/media/data** como root para assets persistentes e compartilhados.
- É permitido o uso de **/tmp** apenas para cache temporário e arquivos descartáveis.
- No disco do SO (/), só é permitido armazenar aplicações em desenvolvimento (ex: builds temporários, testes locais). **É obrigatório** que aplicações como textgen-webui armazenem todos os dados persistentes em **/media/data**.
- Backup externo deve ser feito para partições dedicadas (ex: /media/vivi/backup).

---

## Padrão de Segurança: Autenticidade do Usuário

- Todos os agentes IA do ecossistema Slice/ALIVE devem validar, por múltiplos meios, que estão interagindo exclusivamente com a engenheira responsável pelo ambiente.
- Comandos, requisições e interações só serão aceitos quando a origem for inequivocamente a própria usuária legítima.
- Se detectado input de qualquer outra pessoa (ou origem não validada), os agentes IA devem negar execução, ignorar ou alertar, conforme política definida.
- A detecção e validação de usuário será implementada no submódulo **alive**.

---

## Política de Tráfego e Segurança

- O roteador (Omada ER605) está configurado para:
  - Permitir todo tráfego de saída originado da rede interna de desenvolvimento (ex: 192.168.100.x) para a internet e outros destinos externos.
  - Não bloquear explicitamente tentativas de acesso externo: portas e serviços podem parecer acessíveis, mas todo tráfego externo não autorizado é redirecionado para um **honeypot ativo**.
  - O honeypot serve como isca, simulando alvos reais para enganar, monitorar e registrar ações de atacantes.
  - É possível automatizar respostas, inclusive reativas/retaliatórias, a ataques detectados no honeypot, sem jamais expor a infraestrutura real.
- **Objetivo:**
  - Coletar inteligência sobre tentativas de intrusão, técnicas e perfis de atacantes.
  - Desenvolver e testar contramedidas de defesa e resposta em ambiente seguro.
  - Garantir que a rede real permaneça totalmente isolada, mesmo sob ataque.

---

## Roadmap: Honeypot Supervisionado por IA

- Será desenvolvido um módulo dedicado de honeypot supervisionado por IA, totalmente integrado ao ecossistema Slice/ALIVE.
- O honeypot será monitorado por um agente IA (LLM/finetuned), capaz de analisar em tempo real o comportamento do intrusor.
- Ao detectar um ataque, a própria IA — treinada/fine-tuned para defesa ativa — poderá executar respostas automáticas, inclusive contra-ataques (retaliação controlada), adaptando a estratégia conforme o perfil e a técnica do invasor.
- Todo o processo de retaliação ocorre em ambiente isolado, sem risco para a infraestrutura real.
- Aprendizado incremental: a IA será continuamente refinada com logs reais de ataques.
- Modularidade: o honeypot-IA poderá ser plugado em diferentes topologias Slice/ALIVE.
- Potencial para automação de relatórios, alertas e integração com sistemas de defesa externos.
- Diretrizes éticas e limites para retaliação automatizada serão definidos no ciclo de desenvolvimento.

---

## Política de Autenticação e Isolamento

- A rede de desenvolvimento (ex: 192.168.100.x) é totalmente isolada da rede doméstica e da internet, exceto pelo tráfego de saída controlado.
- Usuário único: apenas a própria engenheira/usuária tem acesso físico e lógico à rede de desenvolvimento.
- **Nunca haverá multiusuário**: todo o ecossistema Slice/ALIVE é projetado para uso exclusivo da engenheira e dos agentes IA. Não há, nem haverá, suporte a múltiplos humanos na rede de desenvolvimento.
- Justificativa: perfil TEA1 (Transtorno do Espectro Autista nível 1), preferência absoluta por ambientes sem interação humana direta.
- Não há autenticação interna entre hosts, serviços ou agentes, pois o ambiente é de uso exclusivo e não multiusuário.
- Acesso externo é feito exclusivamente via VPN, controlada manualmente pela usuária (ex: acesso remoto a partir de outro local).
- Em situações específicas, pode-se abrir temporariamente o Wi-Fi da rede de desenvolvimento para ganho de velocidade de download. Essa abertura é feita manualmente, sob controle direto, e revertida após o uso.
- Qualquer abertura de acesso externo (VPN, Wi-Fi, port forwarding) é sempre controlada manualmente e revertida após a necessidade, mantendo o padrão de isolamento.

---

## Princípio: Velocidade acima de Segurança Absoluta (para automação IA)

- No ecossistema Slice/ALIVE, prioriza-se velocidade, automação e experimentação rápida, mesmo que isso implique em riscos de comandos potencialmente perigosos ou que possam quebrar o sistema.
- O ganho de produtividade, aprendizado incremental e agilidade supera o risco de falhas ocasionais, especialmente em ambiente controlado e de uso exclusivo.
- O ambiente é projetado para ser facilmente restaurável/resetável, então eventuais quebras não são catastróficas.
- Sabe-se que agentes IA podem errar comandos, scripts ou automações, mas isso é aceitável no contexto de desenvolvimento acelerado.
- O importante é que a IA aprenda, registre e evolua com os erros, tornando o ciclo cada vez mais robusto.
- Segurança e validação são bem-vindas, mas nunca devem sacrificar a velocidade e a autonomia do ciclo de automação.

---

## �� Agente Dog — Guardião do Honeypot

- O honeypot Slice/ALIVE é supervisionado por um Agente Dog (IA de defesa ativa).
- O Dog monitora, alerta e responde a ataques, atuando como cão de guarda digital do ecossistema.
- Toda resposta é registrada, auditável e ocorre em ambiente isolado.
- O Dog aprende continuamente com logs de ataques, tornando-se cada vez mais eficiente.
- Analogia: "Se pular o muro, o dog late — e pode morder!"

---

> Este documento será incrementado conforme novas informações forem compartilhadas ou a topologia evoluir.
