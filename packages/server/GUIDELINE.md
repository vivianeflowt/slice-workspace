# 📚 Guidelines para Criação de Services (Domain Services)

## 🎯 Visão Geral

Este documento descreve como criar e estruturar **services** (serviços de domínio) seguindo a arquitetura vertical slice, com foco em modularidade, testabilidade e escalabilidade, usando **TypeScript** e **Express**.

## 🏗️ Arquitetura Vertical Slice

### Estrutura de Diretórios

```plaintext
project-name/
├── src/
│   ├── server.ts                  # Ponto de entrada do servidor Express
│   ├── features/                  # Features organizadas por contexto (ex: speech, image, etc)
│   │   └── [context] /
│   │       ├── index.ts
│   │       ├── controller.ts      # Handlers/Controllers da feature
│   │       ├── service.ts         # Service de domínio da feature
│   │       └── __tests__/         # Testes unitários da feature
│   ├── services/                  # Services globais (cross-feature)
│   │   ├── [serviceName].ts       # Service global reutilizável
│   │   └── __tests__/
│   ├── utils/                     # Utilitários compartilhados
│   ├── routes/                    # Rotas Express (opcional)
│   ├── lib/                       # Classes utilitárias e bases compartilhadas
```

## 🔌 O que é um Service?

- Um **service** encapsula regras de negócio, lógica de domínio ou integrações que não pertencem a um único controller.
- Pode ser específico de uma feature (ex: `features/user/service.ts`) ou global (ex: `services/emailService.ts`).
- Não deve conter lógica de roteamento, HTTP ou apresentação.

## 🛠️ Exemplo de Service de Feature

```typescript
// src/features/user/service.ts
export interface UserService {
  createUser(data: CreateUserDTO): Promise<User>;
  getUserById(id: string): Promise<User | null>;
}

export class UserServiceImpl implements UserService {
  async createUser(data: CreateUserDTO): Promise<User> {
    // Lógica de criação de usuário
    // ...
    return user;
  }
  async getUserById(id: string): Promise<User | null> {
    // Lógica de busca
    // ...
    return user;
  }
}
```

## 🛠️ Exemplo de Service Global

```typescript
// src/services/emailService.ts
export class EmailService {
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    // Integração com provider de e-mail
  }
}
```

## 📦 Convenções de Nomenclatura

- Services de feature: `src/features/[context]/service.ts` ou `src/features/[context]/[context]Service.ts`
- Services globais: `src/services/[serviceName].ts`
- Interfaces: sempre em PascalCase, sufixo `Service` (ex: `UserService`)
- Implementações: sufixo `Impl` se necessário (ex: `UserServiceImpl`)

## 🧪 Testes para Services

```typescript
// src/features/user/__tests__/service.spec.ts
import { UserServiceImpl } from '../service';
describe('UserService', () => {
  it('should create a user', async () => {
    const service = new UserServiceImpl();
    const user = await service.createUser({ name: 'Ana' });
    expect(user).toBeDefined();
  });
});
```

## 🔗 Integração com Controllers

- Controllers devem depender de services para lógica de negócio.
- Exemplo:

```typescript
// src/features/user/controller.ts
import { UserServiceImpl } from './service';
const userService = new UserServiceImpl();

export async function createUserHandler(req, res) {
  const user = await userService.createUser(req.body);
  res.json(user);
}
```

## 📑 Resumo

- Service = lógica de domínio, sem HTTP ou apresentação
- Pode ser de feature ou global
- Testável isoladamente
- Controllers usam services para lógica de negócio
- Nomeação clara e consistente

## 🗄️ Organização de Arquivos de Banco de Dados (DuckDB)

- **Todos os arquivos de banco de dados DuckDB devem ser armazenados na pasta `data` na raiz do pacote (`packages/server/data`)**, fora do diretório `src`, seguindo o mesmo padrão de organização dos logs.
- A pasta `data` é o local centralizado para persistência de dados do banco DuckDB, facilitando backup, versionamento e manutenção.
- Não armazene arquivos de banco dentro de `src` ou subdiretórios de features.
- Exemplo de estrutura:

```plaintext
packages/server/
├── src/
├── data/           # <- arquivos .duckdb, .csv, .json, etc
│   ├── main.duckdb
│   └── ...
├── logs/
```

## 🧩 Preferência por Lodash/fp e Programação Funcional

- Sempre que possível, **prefira o uso do lodash/fp** (`import f from 'lodash/fp'`) para manipulação funcional, imutável e declarativa de dados.
- Utilize pipelines, composição e currying para transformar dados de forma clara e previsível.
- O uso de lodash/fp aumenta a robustez, legibilidade e previsibilidade do código, além de evitar efeitos colaterais.
- Exemplos:
  - Use `f.map('campo')`, `f.flow(f.filter(...), f.map(...))`, etc.
  - Prefira pipelines e composição ao invés de lógica imperativa/manual.
- Isso vale para value objects, validações, serialização, parsing e qualquer lógica de manipulação de dados.

# 🧩 Padrão Facade/Provider: Encapsulamento de Complexidade e Interface Padronizada

No ecossistema ALIVE, toda integração com modelos, serviços externos ou lógica complexa deve ser encapsulada em uma classe (facade/provider) com métodos aderentes ao objetivo e interface clara.

- O usuário da classe **não precisa conhecer a implementação interna** ("caguei pro que tem dentro").
- Basta saber que a classe resolve o problema X e segue uma interface padronizada (ex: `.generate()`, `.analyze()`, `.similarity()`).
- Isso permite:
  - Evoluir, trocar ou refatorar a lógica interna sem impacto no restante do sistema.
  - Facilitar testes, manutenção e onboarding.
  - Garantir convergência incremental: todas as facades/providers tendem a um padrão de interface, tornando o ecossistema previsível e plug-and-play.
- Exemplos:
  - `AbstractAIProvider` define a interface e hooks para providers de IA.
  - `DeepSeekProvider`, `OllamaProvider`, `OpenAIProvider`, `PerplexityProvider` implementam a interface, cada um com sua lógica, mas todos convergem para o mesmo padrão de uso.

**Resumo:**
> Encapsule toda complexidade em classes com métodos aderentes ao objetivo. O usuário só precisa conhecer a interface, nunca a implementação. Isso libera energia para reasoning, arquitetura e evolução incremental, sem ruído ou dependência de detalhes internos.

---

**Consistência e clareza são mais importantes que perfeição. Siga o padrão e mantenha o código escalável.**
