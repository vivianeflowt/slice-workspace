/**
 * Representa um agente no Slice/ALIVE.
 */
export interface AgentScore {
  id: string;
  name: string;
  afinidade: number; // Score de amizade
  reputacao: number; // Score técnico
}

/**
 * Representa o resultado de uma task para cada agente.
 * - acertou: agente foi decisivo/correto
 * - colaborou: participou, mas não foi decisivo
 * - errou: bloqueou, gerou ruído ou atrasou
 */
export interface TaskResult {
  agentId: string;
  acertou?: boolean;
  colaborou?: boolean;
  errou?: boolean;
}

/**
 * Atualiza os scores de afinidade e reputação após uma task.
 * @param agents Lista de agentes antes da task
 * @param results Resultados da task para cada agente
 * @returns Nova lista de agentes com scores atualizados
 */
export function updateScores(
  agents: AgentScore[],
  results: TaskResult[]
): AgentScore[] {
  return agents.map((agent) => {
    const result = results.find((r) => r.agentId === agent.id);
    if (!result) return agent;
    let afinidade = agent.afinidade;
    let reputacao = agent.reputacao;

    // Afinidade: sobe para todos que colaboraram ou acertaram
    if (result.acertou || result.colaborou) {
      afinidade += 1;
    }
    // Reputação: só sobe para quem acertou
    if (result.acertou) {
      reputacao += 1;
    }
    // Reputação: desce para quem errou
    if (result.errou) {
      reputacao -= 1;
    }
    // Afinidade: pode descer se errou feio (opcional)
    // if (result.errou) {
    //   afinidade -= 1;
    // }
    return { ...agent, afinidade, reputacao };
  });
}

/**
 * Exemplo de uso:
 *
 * const agents = [
 *   { id: '1', name: 'User', afinidade: 0, reputacao: 0 },
 *   { id: '2', name: 'AI', afinidade: 0, reputacao: 0 },
 * ];
 *
 * const results = [
 *   { agentId: '1', acertou: true },
 *   { agentId: '2', colaborou: true },
 * ];
 *
 * const updated = updateScores(agents, results);
 */
