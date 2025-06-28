import re
from pathlib import Path

# Caminhos
CURADORIA_DIR = Path(__file__).parent
INPUT = CURADORIA_DIR / 'BRAINSTORM-RESULTS.md'
STEP1 = CURADORIA_DIR / 'step1_segmented.txt'
STEP2 = CURADORIA_DIR / 'step2_metadata.txt'
STEP3 = CURADORIA_DIR / 'step3_cleaned.txt'
STEP4 = CURADORIA_DIR / 'step4_sections.txt'
STEP5 = CURADORIA_DIR / 'step5_deduped.txt'
OUTPUT = CURADORIA_DIR / 'BRAINSTORM-RESULTS-curado.md'
LOG = CURADORIA_DIR / 'curadoria-log.txt'

# Utilitários
METADATA_KEYS = ['provider', 'model', 'temperature', 'file']
SECTION_TITLES = [
    'Technical Issues', 'Security Risks', 'Edge Cases',
    'Optimization Opportunities', 'Best Practices'
]
SECTION_PATTERN = re.compile(r'^(##?\s+)?(' + '|'.join(re.escape(s) for s in SECTION_TITLES) + ')', re.IGNORECASE)

# Step 1: Segmentação
with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()
blocos = [b.strip() for b in content.split('---') if b.strip()]
with open(STEP1, 'w', encoding='utf-8') as f:
    for bloco in blocos:
        f.write('---\n' + bloco + '\n')

# Step 2: Padronização de Metadados
def padroniza_metadata(bloco):
    lines = bloco.splitlines()
    meta = {k: '' for k in METADATA_KEYS}
    body = []
    for line in lines:
        for k in METADATA_KEYS:
            if line.lower().startswith(f'{k}:'):
                meta[k] = line.split(':', 1)[1].strip()
                break
        else:
            body.append(line)
    meta_str = '\n'.join(f'{k}: {meta[k]}' for k in METADATA_KEYS if meta[k])
    return meta_str + '\n' + '\n'.join(body).strip()
blocos2 = [padroniza_metadata(b) for b in blocos]
with open(STEP2, 'w', encoding='utf-8') as f:
    for bloco in blocos2:
        f.write('---\n' + bloco + '\n')

# Step 3: Remoção de Ruído
def remove_ruido(bloco):
    lines = bloco.splitlines()
    clean = []
    for line in lines:
        if any(x in line.lower() for x in ['<think>', 'prompt:', 'json', '{', '}', 'raciocínio', 'explanation']):
            continue
        if line.strip().startswith('maxTokens') or line.strip().startswith('resultLength'):
            continue
        clean.append(line)
    return '\n'.join(clean).strip()
blocos3 = [remove_ruido(b) for b in blocos2]
with open(STEP3, 'w', encoding='utf-8') as f:
    for bloco in blocos3:
        f.write('---\n' + bloco + '\n')

# Step 4: Padronização de Seções
def padroniza_secoes(bloco):
    lines = bloco.splitlines()
    out = []
    for line in lines:
        m = SECTION_PATTERN.match(line.strip())
        if m:
            out.append(f'## {m.group(2)}')
        else:
            out.append(line)
    return '\n'.join(out).strip()
blocos4 = [padroniza_secoes(b) for b in blocos3]
with open(STEP4, 'w', encoding='utf-8') as f:
    for bloco in blocos4:
        f.write('---\n' + bloco + '\n')

# Step 5: Deduplicação de Listas
def deduplica_listas(bloco):
    secoes = {}
    curr_sec = None
    for line in bloco.splitlines():
        sec = None
        for s in SECTION_TITLES:
            if line.strip().lower() == f'## {s.lower()}':
                sec = s
                break
        if sec:
            curr_sec = sec
            secoes[curr_sec] = []
        elif curr_sec and line.strip().startswith('- '):
            if line not in secoes[curr_sec]:
                secoes[curr_sec].append(line)
        elif curr_sec:
            secoes[curr_sec].append(line)
    # Reconstrói bloco
    out = []
    for sec in SECTION_TITLES:
        if sec in secoes:
            out.append(f'## {sec}')
            out.extend(secoes[sec])
    return '\n'.join(out).strip()
blocos5 = [deduplica_listas(b) for b in blocos4]
with open(STEP5, 'w', encoding='utf-8') as f:
    for bloco in blocos5:
        f.write('---\n' + bloco + '\n')

# Step 6: Validação Final e Salvamento
with open(OUTPUT, 'w', encoding='utf-8') as f:
    for bloco in blocos5:
        f.write('---\n' + bloco.strip() + '\n')

with open(LOG, 'w', encoding='utf-8') as f:
    f.write('Curadoria incremental concluída. Etapas intermediárias salvas.\n')
