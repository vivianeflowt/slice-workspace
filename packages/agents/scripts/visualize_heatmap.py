import csv
import os
import webbrowser

HEATMAP_CSV = 'tmp/pipeline_outputs/relevance_heatmap.csv'
HEATMAP_HTML = 'tmp/pipeline_outputs/relevance_heatmap.html'

# Paleta minimalista: cinza (0) → amarelo (0.5) → vermelho (1)
def score_to_color(score):
    # Clamp score
    score = max(0, min(1, float(score)))
    if score <= 0:
        return '#cccccc'  # cinza
    elif score < 0.5:
        # cinza → amarelo
        r = int(204 + (255-204)*score*2)
        g = int(204 + (255-204)*score*2)
        b = int(0)
        return f'rgb({r},{g},{b})'
    else:
        # amarelo → vermelho
        r = 255
        g = int(255 - 255*(score-0.5)*2)
        b = 0
        return f'rgb({r},{g},{b})'

def read_heatmap_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def generate_html(chunks):
    cell_width = 16
    cell_height = 32
    max_cols = 64  # grid compacto
    html = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '<meta charset="UTF-8">',
        '<title>Relevance Heatmap</title>',
        '<style>',
        'body { font-family: sans-serif; background: #222; color: #eee; margin: 0; padding: 0; }',
        '.heatmap { display: flex; flex-wrap: wrap; max-width: 1024px; margin: 32px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px #0008; }',
        '.cell { width: %dpx; height: %dpx; margin: 1px; display: flex; align-items: center; justify-content: center; font-size: 10px; border-radius: 2px; cursor: pointer; transition: outline 0.2s; outline: 1px solid #3333; }' % (cell_width, cell_height),
        '.cell:hover { outline: 2px solid #fff; z-index: 2; }',
        '.legend { max-width: 1024px; margin: 16px auto; display: flex; align-items: center; gap: 16px; }',
        '.legend-bar { width: 120px; height: 16px; background: linear-gradient(to right, #cccccc 0%, yellow 50%, red 100%); border-radius: 8px; border: 1px solid #333; }',
        '</style>',
        '</head>',
        '<body>',
        '<div class="legend">',
        '<span>Relevance:</span>',
        '<div class="legend-bar"></div>',
        '<span style="color:#ccc">Low</span>',
        '<span style="color:#f00">High</span>',
        '</div>',
        '<div class="heatmap">'
    ]
    for i, chunk in enumerate(chunks):
        score = float(chunk['relevancia'])
        color = score_to_color(score)
        tooltip = f"Chunk: {chunk['chunk_file']} | Score: {score:.2f} | Lines: {chunk['start_line']}-{chunk['end_line']}"
        html.append(f'<div class="cell" title="{tooltip}" style="background:{color}"></div>')
    html += [
        '</div>',
        '</body>',
        '</html>'
    ]
    return '\n'.join(html)

def main():
    if not os.path.exists(HEATMAP_CSV):
        print(f'Arquivo CSV não encontrado: {HEATMAP_CSV}')
        return
    chunks = read_heatmap_csv(HEATMAP_CSV)
    html = generate_html(chunks)
    with open(HEATMAP_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Heatmap salvo em: {HEATMAP_HTML}')
    webbrowser.open('file://' + os.path.abspath(HEATMAP_HTML))

if __name__ == '__main__':
    main()
