#!/usr/bin/env python3
"""
Pipeline de relevância incremental - Core Engine Otimizado.
Foco: Robustez + Performance + Extração de Relevância Pura.
"""
import os
import json
import hashlib
import numpy as np
from pathlib import Path
from functools import lru_cache
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import shutil
import re

# Diretório temporário centralizado
TMP_DIR = Path('tmp')
TMP_DIR.mkdir(exist_ok=True)

# Configurações centralizadas
CONFIG = {
    'chunks_dir': str(TMP_DIR / 'chunks'),
    'arquivo_original': 'CHATS_TEXTO_PURO_RECUPERADOS.md',
    'brainstorm_results': str(TMP_DIR / 'BRAINSTORM-RESULTS.md'),
    'chunk_size': 10,
    'marcador_relevancia': 'CONTEM:',
    'max_deslocamentos': 10,
    'passo_deslocamento': 2,
    'deslocamento_min': -10,  # Novo: deslocamento mínimo (negativo)
    'deslocamento_max': 10,   # Novo: deslocamento máximo (positivo)
    'resultados_dir': str(TMP_DIR / 'analises_ciclicas'),
    'relatorio_final': str(TMP_DIR / 'relatorio_relevancia_ciclica.json'),
    'hash_file': str(TMP_DIR / 'hash_arquivo_original.txt'),
    'convergencia_tolerancia': 0.005,  # Mais sensível
    'convergencia_janela': 3,
    'stride_inicial': 5,   # Novo: stride inicial (pode ser igual ao chunk_size para compatibilidade)
    'stride_fino': 1,      # Novo: stride refinado para regiões relevantes
    'limiar_refino': 0.1,  # Novo: taxa de relevância mínima para refinar
}

# Core optimization functions
@lru_cache(maxsize=1)
def carregar_arquivo_original() -> List[str]:
    """Cache do arquivo original em memória - carrega uma vez por execução."""
    return Path(CONFIG['arquivo_original']).read_text(encoding='utf-8').splitlines()

def validar_integridade_dados() -> Optional[str]:
    """Validação robusta e rápida dos dados essenciais."""
    if not Path(CONFIG['arquivo_original']).exists():
        return f"Arquivo original ausente: {CONFIG['arquivo_original']}"

    if not Path(CONFIG['brainstorm_results']).exists():
        return f"BRAINSTORM-RESULTS.md ausente - execute brainstorm.sh primeiro"

    chunks_dir = Path(CONFIG['chunks_dir'])
    if not chunks_dir.exists():
        return f"Diretório chunks ausente: {chunks_dir}"

    chunks = list(chunks_dir.glob('*.md'))
    if len(chunks) < 2:
        return f"Dados insuficientes: apenas {len(chunks)} chunks"

    # Validação de integridade rápida (amostra)
    sample_chunk = chunks[0]
    if not sample_chunk.read_text(encoding='utf-8').strip():
        return "Chunks parecem estar vazios"

    return None

def detectar_mudanca_arquivo() -> bool:
    """Detecção otimizada de mudanças no arquivo original."""
    arquivo_original = Path(CONFIG['arquivo_original'])
    hash_atual = hashlib.md5(arquivo_original.read_bytes()).hexdigest()
    hash_file = Path(CONFIG['hash_file'])

    if hash_file.exists():
        hash_anterior = hash_file.read_text().strip()
        if hash_atual == hash_anterior:
            return False

    hash_file.write_text(hash_atual)
    return True

def limpar_caches_obsoletos():
    """Remove apenas caches realmente obsoletos do diretório tmp."""
    for cache_file in TMP_DIR.glob('cache_deslocamento_*.json'):
        cache_file.unlink(missing_ok=True)

    # Remove diretórios de chunks antigos
    resultados_dir = Path(CONFIG['resultados_dir'])
    if resultados_dir.exists():
        import shutil
        shutil.rmtree(resultados_dir, ignore_errors=True)# Cache inteligente persistente
_cache_chunks = {}  # Cache em memória para chunks carregados

def carregar_chunk_cached(arquivo_path: Path) -> str:
    """Cache inteligente de chunks com lazy loading."""
    cache_key = str(arquivo_path)
    if cache_key not in _cache_chunks:
        _cache_chunks[cache_key] = arquivo_path.read_text(encoding='utf-8')
    return _cache_chunks[cache_key]

def cache_resultado_deslocamento(deslocamento: int, resultado: Dict) -> None:
    """Cache persistente otimizado para resultados de deslocamento no tmp."""
    cache_file = TMP_DIR / f'cache_deslocamento_{deslocamento}.json'
    cache_file.write_text(json.dumps(resultado, separators=(',', ':')))  # Compact JSON

def carregar_cache_deslocamento(deslocamento: int) -> Optional[Dict]:
    """Carregamento otimizado de cache do tmp."""
    cache_file = TMP_DIR / f'cache_deslocamento_{deslocamento}.json'
    if cache_file.exists():
        try:
            return json.loads(cache_file.read_text())
        except (json.JSONDecodeError, OSError):
            cache_file.unlink(missing_ok=True)  # Remove cache corrompido
    return None

# Parse do BRAINSTORM-RESULTS.md - Core da arquitetura
def extrair_chunks_relevantes_do_brainstorm() -> Dict[str, float]:
    """
    Extrai marcações de relevância do BRAINSTORM-RESULTS.md de forma robusta.
    Tolera variações, seções incompletas, erros e timeouts.
    Retorna: {'CHUNK_007.md': 0.92, ...}
    """
    brainstorm_file = Path(CONFIG['brainstorm_results'])
    if not brainstorm_file.exists():
        print('[WARN] BRAINSTORM-RESULTS.md não encontrado.')
        return {}

    conteudo = brainstorm_file.read_text(encoding='utf-8')
    marcacoes = {}
    secoes = conteudo.split('---')
    for idx, secao in enumerate(secoes):
        try:
            if not ('CONTEM' in secao or 'NAO CONTEM' in secao):
                continue
            linhas = secao.split('\n')
            arquivo_chunk = None
            peso_confianca = 0.0
            contem = False
            for linha in linhas:
                # Tenta extrair nome do chunk
                if 'CHUNK_' in linha and '.md' in linha:
                    partes = linha.split('/')
                    if partes:
                        arquivo_chunk = partes[-1].strip()
                # Tolerância a variações de CONTEM/NAO CONTEM
                if linha.strip().upper().startswith('CONTEM'):
                    contem = True
                    # Tenta extrair score de confiança
                    match = re.search(r'confian[çc]a[:=]?\s*([0-9.,]+)', linha, re.IGNORECASE)
                    if match:
                        try:
                            peso_confianca = float(match.group(1).replace(',', '.'))
                        except Exception:
                            peso_confianca = 1.0
                    else:
                        peso_confianca = 1.0
                elif linha.strip().upper().startswith('NAO CONTEM'):
                    contem = False
            if arquivo_chunk and arquivo_chunk.startswith('CHUNK_'):
                marcacoes[arquivo_chunk] = peso_confianca if contem else 0.0
            else:
                # Loga se não conseguiu extrair chunk
                if any(x in secao for x in ['CONTEM', 'NAO CONTEM']):
                    print(f'[WARN] Seção ignorada (sem chunk válido) idx={idx}: {secao[:80]}...')
        except Exception as e:
            print(f'[WARN] Erro ao processar seção idx={idx}: {e} | Conteúdo: {secao[:80]}...')
            continue
    return marcacoes

@lru_cache(maxsize=1)
def carregar_marcacoes_brainstorm() -> Dict[str, float]:
    """Cache das marcações do brainstorm - carrega uma vez por execução."""
    return extrair_chunks_relevantes_do_brainstorm()

# Core analysis functions
def criar_chunks_deslocados_otimizado(deslocamento: int) -> str:
    """Criação otimizada de chunks com deslocamento dinâmico (negativo ou positivo)."""
    destino_dir = Path(CONFIG['resultados_dir']) / f'chunks_shift_{deslocamento}'

    # Fast check - se existem, retorna
    if destino_dir.exists() and list(destino_dir.glob('*.md')):
        return str(destino_dir)

    # Criação otimizada
    destino_dir.mkdir(parents=True, exist_ok=True)
    chunks_dir = Path(CONFIG['chunks_dir'])

    for arquivo_path in chunks_dir.glob('*.md'):
        conteudo = carregar_chunk_cached(arquivo_path)
        linhas = conteudo.splitlines(keepends=True)

        # Deslocamento dinâmico: pode ser negativo ou positivo
        if deslocamento < 0:
            # Move janela para trás (pega linhas antes do chunk original)
            linhas_deslocadas = linhas[abs(deslocamento):] if abs(deslocamento) < len(linhas) else []
            conteudo_final = ''.join(linhas_deslocadas[:CONFIG['chunk_size']])
        elif deslocamento > 0:
            # Move janela para frente (adiciona linhas vazias no início)
            linhas_deslocadas = ['\n'] * deslocamento + linhas
            conteudo_final = ''.join(linhas_deslocadas[:CONFIG['chunk_size']])
        else:
            conteudo_final = ''.join(linhas[:CONFIG['chunk_size']])

        (destino_dir / arquivo_path.name).write_text(conteudo_final, encoding='utf-8')

    return str(destino_dir)

def criar_chunks_deslizantes_adaptativo(linhas: list, stride: int, chunk_size: int) -> list:
    """Gera chunks de tamanho fixo com stride variável."""
    total_linhas = len(linhas)
    chunks = []
    for inicio in range(0, total_linhas - chunk_size + 1, stride):
        chunk = linhas[inicio:inicio + chunk_size]
        if len(chunk) == chunk_size:
            chunks.append((inicio, chunk))
    return chunks

def analisar_relevancia_otimizado(chunks_dir: str, deslocamento: int) -> Dict:
    """Análise de relevância baseada nas marcações do BRAINSTORM-RESULTS.md, usando score de confiança como peso."""
    resultado_cache = carregar_cache_deslocamento(deslocamento)
    if resultado_cache:
        return resultado_cache
    marcacoes_brainstorm = carregar_marcacoes_brainstorm()
    if not marcacoes_brainstorm:
        return {'erro': 'Nenhuma marcação encontrada no BRAINSTORM-RESULTS.md', 'deslocamento': deslocamento}
    soma_pesos = 0.0
    posicoes_relevantes = []
    arquivos_relevantes = []
    total_chunks = len(marcacoes_brainstorm)
    chunk_size = CONFIG['chunk_size']
    for arquivo_chunk, peso in marcacoes_brainstorm.items():
        if peso > 0.0:
            soma_pesos += peso
            try:
                chunk_num = int(arquivo_chunk.replace('CHUNK_', '').replace('.md', ''))
                chunk_idx = chunk_num - 1
                posicao_real = max(0, (chunk_idx * chunk_size) - deslocamento)
                posicoes_relevantes.append(posicao_real)
                arquivos_relevantes.append(arquivo_chunk)
            except (ValueError, AttributeError):
                continue
    taxa_relevancia = soma_pesos / total_chunks if total_chunks > 0 else 0
    metricas_avancadas = {}
    if posicoes_relevantes:
        posicoes_array = np.array(posicoes_relevantes)
        metricas_avancadas = {
            'dispersao': float(np.std(posicoes_array)),
            'concentracao_score': float(1.0 / (1.0 + np.std(posicoes_array))),
            'primeiro_pico': int(np.min(posicoes_array)),
            'ultimo_pico': int(np.max(posicoes_array)),
            'amplitude': int(np.ptp(posicoes_array)),
            'densidade_unica': len(set(posicoes_relevantes)) / len(posicoes_relevantes),
            'mediana_posicao': float(np.median(posicoes_array)),
            'quartil_75': float(np.percentile(posicoes_array, 75))
        }
    resultado = {
        'deslocamento': deslocamento,
        'total_chunks': total_chunks,
        'soma_pesos': soma_pesos,
        'taxa_relevancia': taxa_relevancia,
        'posicoes_relevantes': posicoes_relevantes,
        'arquivos_relevantes': arquivos_relevantes,
        'metricas_avancadas': metricas_avancadas,
        'fonte_marcacoes': 'BRAINSTORM-RESULTS.md',
        'total_marcacoes_ia': len(marcacoes_brainstorm),
        'timestamp': datetime.now().isoformat()
    }
    cache_resultado_deslocamento(deslocamento, resultado)
    return resultado

def verificar_convergencia_otimizada(resultados: List[Dict]) -> Tuple[bool, float]:
    """Verificação de convergência otimizada com métricas múltiplas."""
    if len(resultados) < CONFIG['convergencia_janela']:
        return False, 1.0

    # Análise das últimas N medições
    ultimos = resultados[-CONFIG['convergencia_janela']:]
    taxas = [r['taxa_relevancia'] for r in ultimos]

    # Múltiplos critérios de convergência
    variacao_taxa = max(taxas) - min(taxas)
    media_taxa = sum(taxas) / len(taxas)

    # Convergência mais inteligente
    if variacao_taxa < CONFIG['convergencia_tolerancia']:
        return True, media_taxa

    # Convergência por estabilidade (taxa não muda significativamente)
    if len(resultados) >= 6:
        taxas_anteriores = [r['taxa_relevancia'] for r in resultados[-6:-3]]
        media_anterior = sum(taxas_anteriores) / len(taxas_anteriores)

        if abs(media_taxa - media_anterior) < CONFIG['convergencia_tolerancia']:
            return True, media_taxa

    return False, variacao_taxa
estado_ciclos = {
    'ciclo_atual': 0,
    'melhor_deslocamento': None,
    'historico_resultados': []
}

def executar_analise_ciclica_otimizada() -> Tuple[List[Dict], Dict]:
    """Core engine da análise cíclica com stride adaptativo e compatibilidade total."""
    Path(CONFIG['resultados_dir']).mkdir(exist_ok=True)
    resultados_ciclo = []
    melhor_resultado = {'taxa_relevancia': 0.0, 'deslocamento': 0}
    total_linhas = len(carregar_arquivo_original())
    chunk_size = CONFIG['chunk_size']
    stride_inicial = CONFIG.get('stride_inicial', chunk_size)
    stride_fino = CONFIG.get('stride_fino', 1)
    limiar_refino = CONFIG.get('limiar_refino', 0.1)
    # Passo 1: análise com stride inicial (mais largo)
    for inicio in range(0, total_linhas - chunk_size + 1, stride_inicial):
        deslocamento = inicio
        # Cria chunk dinâmico
        destino_dir = Path(CONFIG['resultados_dir']) / f'chunks_shift_{deslocamento}'
        destino_dir.mkdir(parents=True, exist_ok=True)
        chunk = carregar_arquivo_original()[inicio:inicio + chunk_size]
        chunk_file = destino_dir / f'CHUNK_{inicio+1:03d}.md'
        chunk_file.write_text(''.join(chunk), encoding='utf-8')
        # Análise
        resultado = analisar_relevancia_otimizado(str(destino_dir), deslocamento)
        if 'erro' in resultado:
            continue
        resultados_ciclo.append(resultado)
        if resultado['taxa_relevancia'] > melhor_resultado['taxa_relevancia']:
            melhor_resultado = resultado.copy()
        # Refino local: se taxa de relevância alta, faz stride fino na região
        if resultado['taxa_relevancia'] >= limiar_refino:
            for sub_inicio in range(inicio, inicio + chunk_size, stride_fino):
                if sub_inicio + chunk_size > total_linhas:
                    break
                sub_deslocamento = sub_inicio
                sub_destino_dir = Path(CONFIG['resultados_dir']) / f'chunks_shift_{sub_deslocamento}_fino'
                sub_destino_dir.mkdir(parents=True, exist_ok=True)
                sub_chunk = carregar_arquivo_original()[sub_inicio:sub_inicio + chunk_size]
                sub_chunk_file = sub_destino_dir / f'CHUNK_{sub_inicio+1:03d}.md'
                sub_chunk_file.write_text(''.join(sub_chunk), encoding='utf-8')
                sub_resultado = analisar_relevancia_otimizado(str(sub_destino_dir), sub_deslocamento)
                if 'erro' not in sub_resultado:
                    resultados_ciclo.append(sub_resultado)
                    if sub_resultado['taxa_relevancia'] > melhor_resultado['taxa_relevancia']:
                        melhor_resultado = sub_resultado.copy()
        if len(resultados_ciclo) >= CONFIG['convergencia_janela']:
            convergiu, score = verificar_convergencia_otimizada(resultados_ciclo)
            if convergiu:
                break
    return resultados_ciclo, melhor_resultado

def gerar_mapa_calor_otimizado(melhor_deslocamento: int) -> np.ndarray:
    """Geração otimizada do mapa de calor baseado nas marcações da IA, usando score de confiança como peso."""
    linhas_originais = carregar_arquivo_original()
    total_linhas = len(linhas_originais)
    mapa_pesos = np.zeros(total_linhas, dtype=np.float32)
    marcacoes_brainstorm = carregar_marcacoes_brainstorm()
    chunk_size = CONFIG['chunk_size']
    for arquivo_chunk, peso in marcacoes_brainstorm.items():
        if peso > 0.0:
            try:
                chunk_num = int(arquivo_chunk.replace('CHUNK_', '').replace('.md', ''))
                chunk_idx = chunk_num - 1
                linha_inicio = max(0, (chunk_idx * chunk_size) - melhor_deslocamento)
                linha_fim = min(linha_inicio + chunk_size, total_linhas)
                mapa_pesos[linha_inicio:linha_fim] += peso
            except (ValueError, AttributeError):
                continue
    return mapa_pesos

def extrair_zonas_relevancia_otimizada(mapa_pesos: np.ndarray, percentil: int = 90) -> List[Tuple[int, int, float]]:
    """Extração otimizada de zonas de relevância usando numpy."""
    if mapa_pesos.sum() == 0:
        return []

    # Cálculo otimizado do limiar
    pesos_nao_zero = mapa_pesos[mapa_pesos > 0]
    if len(pesos_nao_zero) == 0:
        return []

    limiar = np.percentile(pesos_nao_zero, percentil)

    # Detecção de zonas usando numpy
    acima_limiar = mapa_pesos >= limiar
    mudancas = np.diff(acima_limiar.astype(int))

    inicios = np.where(mudancas == 1)[0] + 1
    fins = np.where(mudancas == -1)[0] + 1

    # Ajustar para casos especiais
    if acima_limiar[0]:
        inicios = np.concatenate([[0], inicios])
    if acima_limiar[-1]:
        fins = np.concatenate([fins, [len(mapa_pesos)]])

    # Calcular intensidades
    zonas = []
    for inicio, fim in zip(inicios, fins):
        if fim > inicio:
            intensidade = float(np.mean(mapa_pesos[inicio:fim]))
            zonas.append((int(inicio + 1), int(fim), intensidade))  # +1 para indexação humana

    return sorted(zonas, key=lambda x: x[2], reverse=True)

def salvar_relatorio_otimizado(resultados_ciclo: List[Dict], melhor_resultado: Dict, zonas_hot: List[Tuple]) -> Path:
    """Salvamento otimizado do relatório final considerando pesos de confiança no tmp."""
    timestamp = datetime.now().isoformat()

    # Métricas de performance considerando pesos
    total_chunks_analisados = sum(r.get('total_chunks', 0) for r in resultados_ciclo)
    soma_total_pesos = sum(r.get('soma_pesos', 0.0) for r in resultados_ciclo)
    eficiencia_geral = soma_total_pesos / total_chunks_analisados if total_chunks_analisados > 0 else 0

    relatorio = {
        'timestamp': timestamp,
        'performance_metrics': {
            'ciclos_executados': len(resultados_ciclo),
            'total_chunks_analisados': total_chunks_analisados,
            'soma_total_pesos': soma_total_pesos,
            'eficiencia_geral': eficiencia_geral
        },
        'melhor_resultado': melhor_resultado,
        'zonas_maxima_relevancia': [
            {
                'linha_inicio': zona[0],
                'linha_fim': zona[1],
                'intensidade': zona[2],
                'tamanho': zona[1] - zona[0]
            } for zona in zonas_hot
        ],
        'resultados_detalhados': resultados_ciclo,
        'configuracao': CONFIG
    }

    # Salvamento otimizado
    arquivo_relatorio = Path(CONFIG['relatorio_final'])
    arquivo_relatorio.write_text(json.dumps(relatorio, separators=(',', ':'), ensure_ascii=False))

    melhor_deslocamento = melhor_resultado['deslocamento']
    mapa_pesos = gerar_mapa_calor_otimizado(melhor_deslocamento)

    # CSV otimizado usando numpy
    csv_path = TMP_DIR / 'mapa_calor_otimizado.csv'
    with open(csv_path, 'w') as f:
        f.write('linha,peso\n')
        for i, peso in enumerate(mapa_pesos, 1):
            f.write(f'{i},{peso:.4f}\n')

    return arquivo_relatorio

def ler_relatorio_final_seguro(relatorio_path: Path) -> dict:
    """Lê o relatório final de forma robusta, retornando dict vazio se estiver vazio ou corrompido."""
    if not relatorio_path.exists() or relatorio_path.stat().st_size == 0:
        return {}
    try:
        with relatorio_path.open('r', encoding='utf-8') as f:
            conteudo = f.read().strip()
            if not conteudo:
                return {}
            return json.loads(conteudo)
    except Exception:
        return {}

def main():
    """Core engine execution - foco em robustez, performance e extração pura."""
    # Validação rápida e robusta
    erro = validar_integridade_dados()
    if erro:
        print(f"ERRO: {erro}")
        return False

    # Gerenciamento de cache inteligente
    if detectar_mudanca_arquivo():
        limpar_caches_obsoletos()

    try:
        # Core execution
        resultados_ciclo, melhor_resultado = executar_analise_ciclica_otimizada()

        if not resultados_ciclo:
            print("ERRO: Nenhum resultado válido gerado")
            return False

        # Análise final otimizada
        mapa_pesos = gerar_mapa_calor_otimizado(melhor_resultado['deslocamento'])
        zonas_hot = extrair_zonas_relevancia_otimizada(mapa_pesos)

        # Salvamento otimizado
        arquivo_relatorio = salvar_relatorio_otimizado(resultados_ciclo, melhor_resultado, zonas_hot)

        # Output mínimo - apenas essencial
        print(f"SUCESSO: {arquivo_relatorio}")
        print(f"MELHOR_DESLOCAMENTO: {melhor_resultado['deslocamento']}")
        print(f"MELHOR_TAXA: {melhor_resultado['taxa_relevancia']:.4f}")
        print(f"SOMA_PESOS: {melhor_resultado.get('soma_pesos', 0.0):.4f}")
        print(f"ZONAS_HOT: {len(zonas_hot)}")
        print(f"CICLOS_EXECUTADOS: {len(resultados_ciclo)}")
        print(f"FONTE_MARCACOES: {melhor_resultado.get('fonte_marcacoes', 'BRAINSTORM-RESULTS.md')}")
        print(f"CHUNKS_MARCADOS_IA: {melhor_resultado.get('total_marcacoes_ia', 0)}")
        print(f"EFICIENCIA_GERAL: {sum(r.get('soma_pesos', 0.0) for r in resultados_ciclo) / sum(r.get('total_chunks', 1) for r in resultados_ciclo):.4f}")

        # Métricas de performance
        if 'metricas_avancadas' in melhor_resultado:
            metricas = melhor_resultado['metricas_avancadas']
            print(f"CONCENTRACAO_SCORE: {metricas.get('concentracao_score', 0):.4f}")
            print(f"AMPLITUDE_RELEVANCIA: {metricas.get('amplitude', 0)}")

        return True

    except Exception as e:
        print(f"ERRO_CRITICO: {e}")
        return False

if __name__ == '__main__':
    import sys
    success = main()
    sys.exit(0 if success else 1)
