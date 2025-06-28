#!/bin/bash

set -e

# Checar se está dentro de um repositório git
if [ ! -d ".git" ]; then
    echo "❌ Esse diretório não é um repositório Git!"
    exit 1
fi

not_a_monorepo() {
  find . -type d -name .git ! -path './.git' -exec rm -rf {} + || true
  rm -rf node_modules || true
  rm -rf pnpm-lock.yaml || true
  rm -rf pnpm-workspace.yaml || true
  rm -rf package.json || true
  rn -rf pdm.lock || true
  rn -rf.venv || true
}

# limpar repositório de "erros de execução"
not_a_monorepo

# Função para formatar o frontend
format_client() {
    cd packages/client && pnpm format || true
    cd - >/dev/null
}

# Função para formatar o backend
format_server() {
    cd packages/server && pnpm format || true
    cd - >/dev/null
}

# Rodar formatação em paralelo
format_client &
format_server &
wait


# Capturar timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Mensagem de commit padrão
COMMIT_MESSAGE="Auto-commit: $TIMESTAMP"

echo "🚀 Adicionando todas as alterações..."
git add .

echo "🚀 Criando commit automático..."
git commit --allow-empty -m "$COMMIT_MESSAGE" || echo "⚠️ Nada para commitar."

# echo "🚀 Enviando para o repositório remoto (se existir origin)..."
# git push origin $(git rev-parse --abbrev-ref HEAD) || echo "⚠️ Sem repositório remoto configurado."

echo "✅ Auto-commit concluído: $COMMIT_MESSAGE"

# pnpm exec nx generate @nx/express:application --directory=packages/ai-agent --name=ai-agent --unitTestRunner=jest --no-interactive

chmod +x -R ./*.sh
find . -type f -name "*.sh" -exec chmod +x {} \; -print

# docker rm -f $(docker ps -aq)
# docker system prune -a -f --volumes
# find . -type d -name ".git" -exec rm -rf {} +

# sudo sysctl -w net.mptcp.enabled=1
