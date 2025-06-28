# Admin

Este projeto tem como objetivo facilitar a comunicação entre humano e IA, usando principalmente comandos de voz e comportamentos predefinidos.

## Setup

- O projeto utiliza Tailwind CSS para estilização utilitária e React-Bootstrap para componentes rápidos.
- Para customizações, edite `tailwind.config.js` e utilize as classes utilitárias do Tailwind nos componentes React.

# Scripts de Orquestração Backend + Frontend

## Desenvolvimento

Para rodar backend (FastAPI) e frontend (React/Vite) juntos, use:

```sh
pnpm run dev:concurrent
```

- Usa [concurrently](https://www.npmjs.com/package/concurrently) para rodar ambos processos em paralelo.
- Logs de ambos aparecem no terminal, facilitando debug.

## Produção

Para rodar ambos em produção, use:

```sh
pnpm run start:prod
```

- Usa [pm2](https://pm2.keymetrics.io/) para gerenciar processos, restart automático e logs persistentes.
- Configuração em `ecosystem.config.js`.
- Backend: FastAPI (uvicorn) na porta 11111.
- Frontend: Vite preview (build estático).

## Scripts

- `dev:concurrent`: orquestra backend e frontend em dev.
- `backend`: roda apenas o backend.
- `frontend`: roda apenas o frontend.
- `start:prod`: inicia ambos via pm2 para produção.

---

> **Padrão recomendado:**
> - Use `concurrently` em dev para agilidade e logs no terminal.
> - Use `pm2` em produção para robustez, monitoramento e restart automático.
