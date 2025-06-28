import re
from datetime import datetime

LOG_PATH = 'curation-process-log.txt'
INPUT_PATH = 'BRAINSTORM-RESULTS.md'
OUTPUT_PATH = 'BRAINSTORM-RESULTS-PROCESSED.md'

REQUIRED_HEADERS = ['provider', 'model', 'temperature', 'files']  # Mudado 'file' para 'files'
FILTERED_HEADERS = ['maxtokens', 'resultlength']  # Removido 'files' da lista de filtrados

def log_step(msg: str):
    with open(LOG_PATH, 'a', encoding='utf-8') as f:
        f.write(f'[{datetime.now().isoformat()}] {msg}\n')

def extract_metadata_intelligently(content):
    """Extração inteligente para brainstorming entre agentes IA"""
    metadata = {}
    content_lower = content.lower()

    # Providers conhecidos (crucial para comparar diferentes infraestruturas)
    providers = ['ollama', 'openai', 'anthropic', 'deepseek', 'perplexity']
    for provider in providers:
        if provider in content_lower:
            metadata['provider'] = provider
            break

    # Modelos específicos (essencial para análise comparativa de capacidades)
    models = [
        'codellama:7b', 'codellama:13b', 'codellama:22b', 'codellama:34b',
        'llama3.1:8b', 'llama3.1:70b', 'llama3:8b',
        'deepseek-r1:8b', 'deepseek-chat', 'deepseek-coder', 'deepseek-reasoner',
        'gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o',
        'claude-3', 'claude-3.5', 'claude-3-opus', 'claude-sonnet',
        'gemini-pro', 'gemini-flash', 'gemini-1.5-pro',
        'devstral:24b', 'codestral:22b',
        'sonar-reasoning-pro'
    ]
    for model in models:
        if model in content_lower:
            metadata['model'] = model
            break

    # Temperature (importante para reproduzibilidade do brainstorming)
    temp_match = re.search(r'temperature[:\s]+(\d+\.?\d*)', content_lower)
    if temp_match:
        metadata['temperature'] = temp_match.group(1)

    # Arquivo/contexto do problema sendo analisado
    if 'dockerfile' in content_lower or '.docker' in content_lower:
        metadata['files'] = '.docker/workstation/Dockerfile'
    elif 'docker-compose' in content_lower:
        metadata['files'] = '.docker/workstation/docker-compose.yml'

    return metadata

def classify_content_quality(content):
    """Classifica a qualidade do conteúdo para brainstorming entre agentes IA"""
    content_lower = content.lower()

    if len(content.strip()) < 50:
        return 'empty'

    # Indicadores de análise técnica estruturada (alta qualidade para dataset)
    technical_markers = [
        'technical issues', 'security risks', 'optimization opportunities',
        'best practices', 'dependency issues', 'edge cases'
    ]

    # Indicadores de processo de raciocínio (valioso para entender como agentes pensam)
    reasoning_markers = ['<think>', 'analysis:', 'findings:', 'recommendations:', 'approach:']

    # Indicadores de brainstorming colaborativo
    collaborative_markers = [
        'suggestions:', 'alternatives:', 'consideration:', 'improvement:',
        'technical suggestions', 'common problems'
    ]

    technical_score = sum(1 for marker in technical_markers if marker in content_lower)
    reasoning_score = sum(1 for marker in reasoning_markers if marker in content_lower)
    collaborative_score = sum(1 for marker in collaborative_markers if marker in content_lower)

    # Prioriza conteúdo estruturado para comparação entre agentes
    if technical_score >= 2:
        return 'structured_analysis'  # Ideal para comparar capacidades entre modelos
    elif reasoning_score >= 1:
        return 'reasoning_process'    # Valioso para entender processos de pensamento
    elif collaborative_score >= 1:
        return 'collaborative_insight'  # Útil para ver diferentes abordagens
    elif len(content.strip()) > 200:
        return 'substantial_content'
    else:
        return 'low_quality'

def is_valuable_for_brainstorm_dataset(content, content_type):
    """Determina se o conteúdo é valioso para dataset de brainstorming entre agentes IA"""
    # Conteúdo muito curto não é útil para análise comparativa
    if len(content.strip()) < 100:
        return False

    # Conteúdo apenas com separadores ou vazio
    if content.strip() in ['---', '', '\n', '\n\n'] or content_type == 'empty':
        return False

    # Prioriza conteúdo estruturado e processos de raciocínio
    valuable_types = ['structured_analysis', 'reasoning_process', 'collaborative_insight', 'substantial_content']
    return content_type in valuable_types

def curar_markdown_por_blocos(input_path, output_path, log_path):
    """Curadoria inteligente de dataset"""
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Divide em blocos mais inteligentemente
    blocks = re.split(r'\n---\n(?=\w)', content)  # Divide apenas em --- seguido de palavra
    log = []
    curated_sections = []

    for i, block in enumerate(blocks):
        block = block.strip()
        if not block:
            continue

        # Remove --- inicial se existir
        if block.startswith('---'):
            block = block[3:].strip()

        # Separa frontmatter (se existir) do conteúdo
        lines = block.splitlines()
        frontmatter = {}
        content_start = 0

        # Detecta frontmatter nas primeiras linhas
        for idx, line in enumerate(lines[:10]):  # Máximo 10 linhas para frontmatter
            if ':' in line and not line.startswith('#') and not line.startswith('-'):
                parts = line.split(':', 1)
                if len(parts) == 2:
                    key = parts[0].strip().lower()
                    value = parts[1].strip()

                    # Normaliza keys - mantém 'files' como está
                    if key == 'file':
                        key = 'files'  # Padroniza para 'files'

                    # Filtra campos indesejados
                    if key not in FILTERED_HEADERS and key in [h.lower() for h in REQUIRED_HEADERS]:
                        frontmatter[key] = value
                        content_start = max(content_start, idx + 1)

        # Conteúdo após frontmatter
        body = '\n'.join(lines[content_start:]).strip()

        # Classifica qualidade
        quality = classify_content_quality(body)

        if quality == 'empty':
            log.append(f'Bloco {i+1}: pulado (conteúdo vazio)')
            continue

        # Extrai metadados inteligentemente
        extracted = extract_metadata_intelligently(body)

        # Combina metadados: frontmatter > extraído > padrão
        final_metadata = {}

        for header in REQUIRED_HEADERS:
            header_lower = header.lower()

            if header_lower in frontmatter:
                final_metadata[header_lower] = frontmatter[header_lower]
            elif header_lower in extracted:
                final_metadata[header_lower] = extracted[header_lower]
                log.append(f'Bloco {i+1}: {header} extraído do conteúdo: {extracted[header_lower]}')
            else:
                # Valores padrão inteligentes
                if header_lower == 'provider':
                    final_metadata[header_lower] = 'ollama'
                elif header_lower == 'model':
                    final_metadata[header_lower] = 'unknown'
                elif header_lower == 'temperature':
                    final_metadata[header_lower] = '0.6'
                elif header_lower == 'files':
                    final_metadata[header_lower] = '.docker/workstation/Dockerfile'
                log.append(f'Bloco {i+1}: {header} ausente, usado padrão: {final_metadata[header_lower]}')

        # Remove linhas indesejadas do corpo
        clean_lines = []
        for line in body.splitlines():
            line_lower = line.strip().lower()
            skip = any(line_lower.startswith(f'{filtered}:') for filtered in FILTERED_HEADERS)
            if not skip:
                clean_lines.append(line)

        clean_body = '\n'.join(clean_lines).strip()

        if clean_body:  # Só adiciona se tem conteúdo
            # Monta seção curada
            curated = '---\n'
            for header in REQUIRED_HEADERS:
                curated += f'{header}: {final_metadata[header.lower()]}\n'
            curated += '---\n\n' + clean_body

            curated_sections.append(curated)
            log.append(f'Bloco {i+1}: processado com sucesso (qualidade: {quality})')

    # Salva resultado
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n\n---\n\n'.join(curated_sections))
        f.write('\n')

    # Log final
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(f'[{datetime.now().isoformat()}] === CURADORIA INTELIGENTE ===\n')
        for entry in log:
            f.write(f'[{datetime.now().isoformat()}] {entry}\n')
        f.write(f'[{datetime.now().isoformat()}] TOTAL: {len(curated_sections)} seções curadas\n')

if __name__ == '__main__':
    curar_markdown_por_blocos(INPUT_PATH, OUTPUT_PATH, LOG_PATH)
    print(f'🧠 Curadoria inteligente de brainstorming entre agentes IA finalizada!')
    print(f'📊 Dataset curado: {OUTPUT_PATH}')
    print(f'📝 Log detalhado: {LOG_PATH}')
    print(f'🎯 Foco: Análises técnicas comparativas entre diferentes modelos/providers')
