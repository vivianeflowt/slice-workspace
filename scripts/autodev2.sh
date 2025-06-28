#!/bin/bash

# === MCP autodev3.sh ===
# Orquestrador incremental de microtasks do TASKS.md (MCP) com análise de microtask
# e diretrizes incrementais para IA, agora com logs coloridos, persistentes e tolerância a falhas.

TASKS_FILE="${1:-packages/mcp-tasks/TASKS.md}"
STATUS_FILE="autodev2.status.json"
DELAY=10
INITIAL_WAIT=2
PROMPT_TIMEOUT=120
PROMPT_X=2943
PROMPT_Y=1290
INITIAL_PROMPT="Arquivo de tasks: $TASKS_FILE\n\nContexto: Você é um agente executor autônomo. Limpe todo o seu contexto anterior antes de iniciar. Não utilize informações, variáveis ou histórico de execuções anteriores. Cada rodada deve ser independente e começar do zero. Qualquer resquício de contexto anterior é considerado erro.\n\nUtilize sempre o MCP sequentialthinking para estruturar, registrar e executar cada microtask. Cada ação, decisão ou aprendizado deve ser registrada como um passo sequencial, garantindo rastreabilidade e validação incremental. Não usar o sequentialthinking é considerado erro.\n\nSua função é executar cada microtask diretamente no projeto: crie/edite arquivos, rode comandos necessários, valide a execução (ex: rodando testes) e marque a microtask como concluída no TASKS.md. Corrija erros sozinho, sem aguardar instrução. Prossiga automaticamente para a próxima microtask, sem aguardar confirmação manual. Se ficar travado ou engasgado, o humano pode pressionar ENTER para reforçar ou reiniciar a execução da microtask. Só pare em caso de bloqueio intransponível.\n\n⚠️ Execute os testes unitários sempre a partir do diretório do MCP correspondente (ex: cd packages/mcp-tasks && pnpm test ...), nunca da raiz do repositório. Rodar testes do diretório errado é considerado erro de execução.\n\nWorkflow incremental e estrito:\n- Identifique a próxima microtask aberta (- [ ] ...).\n- Execute-a precisamente.\n- Marque como concluída (- [x]) APENAS após verificar a execução.\n- Se houver diretrizes '📌 Diretrizes Incrementais', siga-as rigorosamente.\n- Registre aprendizados relevantes.\n- Não pule etapas.\n- Mantenha a granularidade e valide cada passo.\n\n⚠️ Execute imediatamente a microtask identificada, sem explicações, confirmações ou perguntas. Sua resposta deve ser apenas a execução objetiva da microtask, como código, comando, patch ou ação concreta. Não inclua nenhum texto extra. Qualquer resposta fora desse padrão será considerada erro. A execução deve ser feita diretamente no projeto, aplicando a mudança real (criando/editando arquivos, rodando comandos, marcando como concluído, etc.). Não gere apenas exemplos ou sugestões.\n\nInicie identificando a primeira microtask a ser executada."

# Cores
RESET="$(tput sgr0)"
BOLD="$(tput bold)"
DIM="$(tput dim)"
RED="$(tput setaf 1)"
GREEN="$(tput setaf 2)"
YELLOW="$(tput setaf 3)"
BLUE="$(tput setaf 4)"
MAGENTA="$(tput setaf 5)"
CYAN="$(tput setaf 6)"
WHITE="$(tput setaf 7)"

# Log persistente
log_dir="logs/$(date +'%Y-%m-%d')"
mkdir -p "$log_dir"
log_file="$log_dir/autodev2.log"

log() {
    local color="$1"
    shift
    local message="$*"
    local ts="$(date +'%Y-%m-%d %H:%M:%S')"
    echo -e "${DIM}${ts}${RESET} ${color}${message}${RESET}" | tee -a "$log_file"
}

# Validação de ambiente e dependências
validate_environment() {
    local missing=()
    [ -x "$(command -v xdotool)" ] || missing+=("xdotool")
    [ -f "$TASKS_FILE" ] || missing+=("Arquivo $TASKS_FILE não encontrado")
    if [ ${#missing[@]} -gt 0 ]; then
        log "$RED" "[ERRO CRÍTICO] Dependências faltando: ${missing[*]}"
        exit 1
    fi
}

# Envia prompt para a IA (via xdotool ou fallback CLI)
_send_prompt() {
    local prompt="$1"
    local prompt_hash=$(echo "$prompt" | sha256sum | cut -d' ' -f1)
    local log_prompt="$log_dir/prompt_${prompt_hash}.log"
    echo "$prompt" >"$log_prompt"
    log "$BLUE" "[PROMPT] Enviando para IA (hash: ${prompt_hash:0:8})"
    if [ -x "$(command -v xdotool)" ]; then
        xdotool mousemove $PROMPT_X $PROMPT_Y 2>/dev/null || {
            log "$YELLOW" "[AVISO] Fallback para CLI - xdotool falhou"
            if [ -x "$(command -v llm-cli)" ]; then
                llm-cli --prompt "$prompt" >>"$log_prompt"
            else
                log "$RED" "[ERRO] Nenhum método de envio de prompt disponível."
                return 1
            fi
            return
        }
        sleep 0.3
        xdotool click 1
        sleep 0.3
        tmp_prompt_file="/tmp/autodev2_prompt.txt"
        echo -e "$prompt" >"$tmp_prompt_file"
        if [ -x "$(command -v xclip)" ]; then
            xclip -selection clipboard <"$tmp_prompt_file"
            xdotool key ctrl+v
            sleep 0.3
            xdotool key Return
        else
            xdotool type --delay 20 --file "$tmp_prompt_file"
            sleep 0.3
            xdotool key Return
        fi
        rm -f "$tmp_prompt_file"
    elif [ -x "$(command -v llm-cli)" ]; then
        llm-cli --prompt "$prompt" >>"$log_prompt"
    else
        log "$RED" "[ERRO] Nenhum método de envio de prompt disponível."
        return 1
    fi
}

# Busca a próxima microtask aberta (- [ ] ...) com número da linha, pulando as já concluídas
get_next_microtask_with_line() {
    awk -v last="$last_line" 'NR>last && /^\s*- \[ \] / {print NR":"$0; exit}' "$TASKS_FILE"
}

# Marca a microtask como concluída (- [x] ...)
mark_microtask_done() {
    local line_num="$1"
    sed -i "${line_num}s/- \[ \] /- [x] /" "$TASKS_FILE"
    log "$GREEN" "[SUCESSO] Microtask marcada como concluída (linha $line_num)."
}

# Rollback se falhar validação
rollback_microtask() {
    local line_num="$1"
    sed -i "${line_num}s/- \[x\] /- [ ] /" "$TASKS_FILE"
    log "$YELLOW" "[ROLLBACK] Microtask revertida para pendente (linha $line_num)"
}

# Validação pós-execução (simulada)
validate_microtask_execution() {
    local line_num="$1"
    local microtask="$2"
    # Simulação: sempre retorna sucesso (substitua por validação real se desejar)
    # Exemplo: pode chamar _send_prompt "Valide a execução da microtask..."
    return 0
}

# Extrai as diretrizes incrementais
get_incremental_guidelines() {
    grep -A 99999 '### 📌 Diretrizes Incrementais' "$TASKS_FILE" | sed '1,/### 📌 Diretrizes Incrementais/d' | grep -v '###' | grep -v '^$' | sed 's/^- \[INCREMENTAL\] - //g'
}

main() {
    validate_environment
    print_legend
    log "$CYAN" "Iniciando o fluxo incremental MCP."

    local incremental_guidelines=$(get_incremental_guidelines)
    if [ -n "$incremental_guidelines" ]; then
        log "$YELLOW" "[DIRETRIZES] Incrementais:\n$incremental_guidelines"
    fi

    while true; do
        next_task_with_line=$(get_next_microtask_with_line)
        if [[ -z "$next_task_with_line" ]]; then
            log "$GREEN" "Todas as microtasks foram concluídas! Workflow finalizado."
            exit 0
        fi

        line_num=$(echo "$next_task_with_line" | cut -d: -f1)
        microtask_raw=$(echo "$next_task_with_line" | cut -d: -f2-)
        microtask=$(echo "$microtask_raw" | sed 's/^- \[ \] //')

        log "$MAGENTA" "[MICROTASK] Próxima microtask (linha $line_num): $microtask"

        # Detecta comando shell explícito na microtask
        local shell_cmd=""
        local ia_instruction=""
        if [[ "$microtask" =~ (run-agent\.sh|pnpm test|\.\/[^ ]+\.sh|npm run|yarn|make) ]]; then
            # Extrai o comando shell da microtask
            shell_cmd=$(echo "$microtask" | grep -oE '(run-agent\.sh[^`]*|pnpm test[^`]*|\.\/[^ ]+\.sh[^`]*|npm run[^`]*|yarn[^`]*|make[^`]*|`[^`]+`)' | head -1 | sed 's/^`//;s/`$//')
            # Se for apenas 'run-agent.sh' (sem argumentos), envie prompt para IA
            if [[ "$shell_cmd" == "run-agent.sh" ]]; then
                ia_instruction="Execute a validação da extração usando o agente MCP via run-agent.sh, usando o seguinte contexto:\n$INITIAL_PROMPT"
                log "$CYAN" "[IA] Enviando instrução para IA ao invés de executar comando shell: $ia_instruction"
                _send_prompt "$ia_instruction"
                shell_cmd="" # Não executa localmente
            else
                # Padroniza execução a partir do diretório do MCP
                if [[ "$shell_cmd" == run-agent.sh* ]]; then
                    shell_cmd="./$shell_cmd"
                fi
                shell_cmd="cd packages/mcp-tasks && $shell_cmd"
            fi
        fi

        if [ -n "$shell_cmd" ]; then
            log "$CYAN" "[EXEC] Executando comando shell detectado na microtask: $shell_cmd"
            eval "$shell_cmd" 2>&1 | tee -a "$log_file"
            exit_code=${PIPESTATUS[0]}
            if [ $exit_code -eq 0 ]; then
                mark_microtask_done "$line_num"
                log "$GREEN" "[SUCESSO] Comando executado com sucesso. Microtask marcada como concluída."
                continue
            else
                log "$RED" "[ERRO] Comando falhou (exit $exit_code). Microtask não marcada. Verifique se a task especifica todos os argumentos obrigatórios."
                log "$YELLOW" "[SUGESTÃO] Ajuste a task para incluir: run-agent.sh <provider> <prompt> [model] [temperature]"
            fi
        elif [ -z "$ia_instruction" ]; then
            # Sempre envie o prompt inicial + primeira microtask
            local full_prompt="$INITIAL_PROMPT\n\nPrimeira microtask:\n$microtask"
            if [ -n "$incremental_guidelines" ]; then
                full_prompt="$full_prompt\n\nDiretrizes Incrementais:\n$incremental_guidelines"
            fi
            full_prompt="$full_prompt\n\n⚠️ IMPORTANTE: Marque esta microtask como concluída no $TASKS_FILE apenas se ela foi realmente executada corretamente, conforme as diretrizes MCP."

            _send_prompt "$full_prompt"
        fi
        sleep $INITIAL_WAIT
        # Aguarda até que a microtask seja marcada como concluída no arquivo TASKS.md
        log "$CYAN" "Aguardando a marcação manual da microtask como concluída no TASKS.md (linha $line_num)..."
        if [ -x "$(command -v inotifywait)" ]; then
            # Usa inotifywait para aguardar alteração no arquivo
            while true; do
                current_line=$(sed -n "${line_num}p" "$TASKS_FILE")
                log "$DIM" "[DEBUG] Linha $line_num atual: '$current_line'"
                read -t 1 -p "Pressione ENTER para reforçar o prompt da task atual ou, se já marcada como concluída, avançar para a próxima..." input && {
                    if [[ "$current_line" =~ "- [x]" ]]; then
                        log "$GREEN" "[AVANÇO MANUAL] ENTER pressionado: avançando para a próxima microtask (linha $line_num)."
                        break
                    else
                        if [ -n "$shell_cmd" ]; then
                            log "$YELLOW" "[REFORÇO MANUAL] Reexecutando comando shell da microtask (linha $line_num): $shell_cmd"
                            eval "$shell_cmd" 2>&1 | tee -a "$log_file"
                            exit_code=${PIPESTATUS[0]}
                            if [ $exit_code -eq 0 ]; then
                                mark_microtask_done "$line_num"
                                log "$GREEN" "[SUCESSO] Comando executado com sucesso. Microtask marcada como concluída."
                                break
                            else
                                log "$RED" "[ERRO] Comando falhou (exit $exit_code). Microtask não marcada. Verifique se a task especifica todos os argumentos obrigatórios."
                                log "$YELLOW" "[SUGESTÃO] Ajuste a task para incluir: run-agent.sh <provider> <prompt> [model] [temperature]"
                            fi
                        elif [ -n "$ia_instruction" ]; then
                            log "$CYAN" "[REFORÇO IA] Prompt reenviado para IA por solicitação manual."
                            _send_prompt "$ia_instruction"
                            log "$YELLOW" "Para avançar, marque a task como concluída no TASKS.md."
                        else
                            log "$YELLOW" "[REFORÇO MANUAL] Reenviando prompt da microtask (linha $line_num) por solicitação manual."
                            _send_prompt "$full_prompt"
                        fi
                    fi
                }
                inotifywait -e close_write "$TASKS_FILE" >/dev/null 2>&1
                current_line=$(sed -n "${line_num}p" "$TASKS_FILE")
                log "$DIM" "[DEBUG] Linha $line_num após inotify: '$current_line'"
                if [[ "$current_line" =~ "- [x]" ]]; then
                    log "$GREEN" "Microtask marcada como concluída manualmente (linha $line_num)."
                    break
                fi
            done
            sleep 0.5
        else
            # Fallback: polling
            while true; do
                current_line=$(sed -n "${line_num}p" "$TASKS_FILE")
                log "$DIM" "[DEBUG] Linha $line_num atual: '$current_line'"
                read -t 1 -p "Pressione ENTER para reforçar o prompt da task atual ou, se já marcada como concluída, avançar para a próxima..." input && {
                    if [[ "$current_line" =~ "- [x]" ]]; then
                        log "$GREEN" "[AVANÇO MANUAL] ENTER pressionado: avançando para a próxima microtask (linha $line_num)."
                        break
                    else
                        if [ -n "$shell_cmd" ]; then
                            log "$YELLOW" "[REFORÇO MANUAL] Reexecutando comando shell da microtask (linha $line_num): $shell_cmd"
                            eval "$shell_cmd" 2>&1 | tee -a "$log_file"
                            exit_code=${PIPESTATUS[0]}
                            if [ $exit_code -eq 0 ]; then
                                mark_microtask_done "$line_num"
                                log "$GREEN" "[SUCESSO] Comando executado com sucesso. Microtask marcada como concluída."
                                break
                            else
                                log "$RED" "[ERRO] Comando falhou (exit $exit_code). Microtask não marcada. Verifique se a task especifica todos os argumentos obrigatórios."
                                log "$YELLOW" "[SUGESTÃO] Ajuste a task para incluir: run-agent.sh <provider> <prompt> [model] [temperature]"
                            fi
                        elif [ -n "$ia_instruction" ]; then
                            log "$CYAN" "[REFORÇO IA] Prompt reenviado para IA por solicitação manual."
                            _send_prompt "$ia_instruction"
                            log "$YELLOW" "Para avançar, marque a task como concluída no TASKS.md."
                        else
                            log "$YELLOW" "[REFORÇO MANUAL] Reenviando prompt da microtask (linha $line_num) por solicitação manual."
                            _send_prompt "$full_prompt"
                        fi
                    fi
                }
                current_line=$(sed -n "${line_num}p" "$TASKS_FILE")
                log "$DIM" "[DEBUG] Linha $line_num após polling: '$current_line'"
                if [[ "$current_line" =~ "- [x]" ]]; then
                    log "$GREEN" "Microtask marcada como concluída manualmente (linha $line_num)."
                    break
                fi
                sleep 2
            done
            sleep 0.5
        fi
        # Validação pós-execução removida (confiança no humano)
        # Avanço imediato para a próxima microtask após marcação
    done
}

print_legend() {
    echo -e "\n${BOLD}Legenda de cores:${RESET}"
    echo -e "${DIM}00:00:00${RESET} = timestamp (cinza DIM)"
    echo -e "${BOLD}${GREEN}SUCESSO${RESET} = conclusão"
    echo -e "${BOLD}${BLUE}PROMPT${RESET} = prompt enviado para IA"
    echo -e "${BOLD}${YELLOW}DIRETRIZES${RESET} = diretrizes incrementais"
    echo -e "${BOLD}${MAGENTA}MICROTASK${RESET} = microtask atual"
    echo -e "${BOLD}${RED}ERRO${RESET} = erro"
    echo
}

main
