# 🛠️ Tasklist: Criar Hello World em TypeScript

## 🎯 Objetivo
Criar um projeto básico "Hello World" usando TypeScript, com estrutura mínima, types instalados e compilação funcionando.

---

## ✅ Etapas

- [ ] **Inicializar projeto**
  - Executar: `npm init -y`
  - Final esperado: `package.json` criado.

- [ ] **Instalar TypeScript**
  - Executar: `npm install typescript --save-dev`
  - Final esperado: `node_modules/`, `package-lock.json`, dependência no `devDependencies`.

- [ ] **Instalar tipos do Node.js**
  - Executar: `npm install @types/node --save-dev`
  - Final esperado: dependência no `devDependencies`.

- [ ] **Gerar tsconfig.json**
  - Executar: `npx tsc --init`
  - Final esperado: arquivo `tsconfig.json` com configurações padrão.

- [ ] **Criar diretório de código-fonte**
  - Criar pasta: `src/`

- [ ] **Criar arquivo principal**
  - Criar arquivo: `src/index.ts`
  - Conteúdo:
    ```ts
    console.log("Hello, world!");
    ```

- [ ] **Atualizar `tsconfig.json`**
  - Ajustar opções:
    ```json
    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "strict": true,
        "rootDir": "./src",
        "outDir": "./dist",
        "esModuleInterop": true,
        "types": ["node"]
      }
    }
    ```

- [ ] **Adicionar scripts ao `package.json`**
  - Incluir em `"scripts"`:
    ```json
    {
      "build": "tsc",
      "start": "node dist/index.js"
    }
    ```

- [ ] **Compilar o projeto**
  - Executar: `npm run build`
  - Final esperado: pasta `dist/` com `index.js` gerado.

- [ ] **Executar o código compilado**
  - Executar: `npm start`
  - Saída esperada: `Hello, world!`

---

## 🧠 Observações para Agentes

- Evite instalações globais.
- Assuma ambiente local e isolado.
- Verifique se `node` e `npm` estão disponíveis antes de iniciar.
- Ao finalizar todas as etapas com sucesso, **fique em silêncio**.
