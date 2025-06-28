# 🚀 Guia de Desenvolvimento

## 📋 Índice

- [🚀 Guia de Desenvolvimento](#-guia-de-desenvolvimento)
  - [📋 Índice](#-índice)
  - [🔗 Alinhamento com os Princípios Fundamentais do Ecossistema (CONCEPTS.md)](#-alinhamento-com-os-princípios-fundamentais-do-ecossistema-conceptsmd)
  - [🎯 Visão Geral](#-visão-geral)
    - [Tecnologias Principais](#tecnologias-principais)
    - [Pré-requisitos](#pré-requisitos)
  - [📁 Estrutura do Projeto](#-estrutura-do-projeto)
  - [🗂️ Organização de Pastas e Responsabilidades](#️-organização-de-pastas-e-responsabilidades)
  - [📦 Padronização e Validação de Dependências](#-padronização-e-validação-de-dependências)
    - [Exemplos práticos](#exemplos-práticos)
    - [Motivos para padronizar](#motivos-para-padronizar)
  - [📏 Regra Fundamental de Consulta ao Guideline](#-regra-fundamental-de-consulta-ao-guideline)
  - [🔄 Princípio Plug-and-Play Slice/ALIVE](#-princípio-plug-and-play-slicealive)
  - [️ Princípio Open/Closed (OCP) e a pasta @/base](#️-princípio-openclosed-ocp-e-a-pasta-base)
    - [Conceito](#conceito)
    - [Como aplicar](#como-aplicar)
    - [Exemplo prático](#exemplo-prático)
      - [1. Classe Abstrata (Contrato)](#1-classe-abstrata-contrato)
      - [2. Implementação concreta](#2-implementação-concreta)
    - [Boas práticas para OCP e @/base](#boas-práticas-para-ocp-e-base)
    - [Checklist para aplicar OCP](#checklist-para-aplicar-ocp)
  - [🧩 Herança e Composição com Schemas Zod](#-herança-e-composição-com-schemas-zod)
    - [Conceito](#conceito-1)
    - [Exemplo Prático](#exemplo-prático-1)
    - [Boas Práticas](#boas-práticas)
    - [Checklist para Schemas Zod](#checklist-para-schemas-zod)
  - [🎯 Programação Funcional](#-programação-funcional)
    - [Princípios](#princípios)
    - [Lodash/FP](#lodashfp)
    - [Padrões Comuns](#padrões-comuns)
    - [Boas Práticas](#boas-práticas-1)
    - [Exemplos de Uso](#exemplos-de-uso)
    - [🚩 Reforço: Uso obrigatório de lodash/fp](#-reforço-uso-obrigatório-de-lodashfp)
      - [Exemplos práticos com `f`:](#exemplos-práticos-com-f)
  - [💻 Padrões de Código](#-padrões-de-código)
    - [Nomenclatura](#nomenclatura)
    - [Formatação](#formatação)
    - [Imports](#imports)
  - [🎯 Tipagem](#-tipagem)
    - [Boas Práticas](#boas-práticas-2)
    - [🚩 Preferência por Zod em vez de interface para contratos de dados](#-preferência-por-zod-em-vez-de-interface-para-contratos-de-dados)
      - [Exemplo prático:](#exemplo-prático-2)
  - [🚨 Tratamento de Erros](#-tratamento-de-erros)
    - [Padrão de Erros](#padrão-de-erros)
    - [Validação de Input](#validação-de-input)
  - [⚡ Performance](#-performance)
    - [Otimizações](#otimizações)
  - [🔒 Segurança](#-segurança)
    - [Boas Práticas](#boas-práticas-3)
  - [🧪 Testes](#-testes)
    - [Padrões](#padrões)
  - [📝 Documentação](#-documentação)
    - [JSDoc](#jsdoc)
    - [Comentários](#comentários)
  - [🔄 Fluxo de Trabalho](#-fluxo-de-trabalho)
    - [Desenvolvimento](#desenvolvimento)
  - [🎭 Padrão Facade](#-padrão-facade)
    - [Conceito](#conceito-2)
    - [Princípios](#princípios-1)
    - [Exemplos de Implementação](#exemplos-de-implementação)
    - [Boas Práticas](#boas-práticas-4)
    - [Checklist de Implementação](#checklist-de-implementação)
    - [Benefícios](#benefícios)
  - [🧪 Organização de Testes Unitários](#-organização-de-testes-unitários)
    - [Exemplos Avançados com lodash/fp](#exemplos-avançados-com-lodashfp)
    - [Exemplos Avançados com Zod](#exemplos-avançados-com-zod)
    - [Exemplo Integrado: lodash/fp + Zod](#exemplo-integrado-lodashfp--zod)
  - [🌐 Interoperabilidade: Zod e JSON Schema para Python e outros stacks](#-interoperabilidade-zod-e-json-schema-para-python-e-outros-stacks)
      - [Exemplo prático de exportação e consumo:](#exemplo-prático-de-exportação-e-consumo)

## 🔗 Alinhamento com os Princípios Fundamentais do Ecossistema (CONCEPTS.md)

> Este guideline está subordinado aos princípios definidos em `slice-workflow/CONCEPTS.md`. Toda decisão, padrão ou fluxo aqui descrito deve respeitar e refletir as leis fundamentais do ecossistema Slice/ALIVE.
>
> **Resumo dos principais conceitos obrigatórios:**
>
> - **Baixo recurso & custo mínimo:** Soluções sempre priorizam uso local, open source e mínimo de dependências externas.
> - **Plug-and-play total:** Todo módulo deve ser instalável e utilizável via Makefile, sem etapas manuais obscuras.
> - **Validação incremental:** Nada é padronizado sem validação prática, registro de aprendizados e documentação viva.
> - **Documentação viva e rastreável:** Toda decisão, ajuste ou aprendizado é registrado (CONTEXT.md, HISTORY.md, etc.).
> - **Flexibilidade e modularidade:** Frameworks opinativos são evitados; bibliotecas tipadas e modulares são preferidas.
> - **Validação forte e padronizada:** Uso obrigatório de Zod (TypeScript) e JSON Schema (Python) para contratos de dados.
> - **Banimento de Claude 4 e variantes:** Proibido o uso/integracao desses modelos por motivos técnicos e de segurança.
> - **Restauração rápida:** Todo o ecossistema deve ser reconstruível do zero em menos de 30 minutos.
> - **Curadoria de licença:** Toda ferramenta/biblioteca deve ter licença compatível e validada.
>
> Para detalhes, justificativas e exemplos, consulte sempre o `CONCEPTS.md`. Em caso de conflito, o conceito registrado prevalece sobre qualquer guideline local.

## 🎯 Visão Geral

Este projeto é um processador de conteúdo com suporte a múltiplos formatos e embeddings, desenvolvido em TypeScript.

### Tecnologias Principais

- TypeScript
- Node.js
- ESLint
- Prettier
- Vitest
- pnpm

### Pré-requisitos

- Node.js 18+
- pnpm 10+
- Git

## 📁 Estrutura do Projeto

```
.
├── src/                    # Código fonte
│   ├── utils/             # Utilitários
│   ├── services/          # Serviços
│   ├── types/             # Definições de tipos
│   └── main.ts            # Ponto de entrada
├── tests/                 # Testes
├── dist/                  # Código compilado
├── .eslintrc.json        # Configuração ESLint
├── .prettierrc           # Configuração Prettier
├── tsconfig.json         # Configuração TypeScript
└── package.json          # Dependências e scripts
```

## 🗂️ Organização de Pastas e Responsabilidades

- **@/utils**: Somente funções puras, reutilizáveis e com responsabilidade única. Não dependem de estado global, side effects ou contexto externo. Exemplo: `parseDate`, `sanitizeString`, `calculateSum`.

- **@/base**: Classes abstratas para definir interfaces e contratos. Usadas para garantir compatibilidade e padronização entre implementações. Exemplo: `BaseService`, `AbstractRepository`.

- **@/lib**: Classes que abstraem funcionalidades específicas, encapsulando lógica de integração, I/O, ou recursos externos. Exemplo: `HttpClient`, `FileStorage`, `DatabaseAdapter`.

- **@/config**: Configuração do projeto centralizada em classes. Facilita import/export, versionamento e uso programático. Exemplo: `AppConfig`, `DatabaseConfig`.

- **@/constants**: Nunca use "magic numbers" ou strings soltas. Defina constantes nomeadas para valores fixos, limites, chaves, etc. Exemplo: `MAX_FILE_SIZE`, `DEFAULT_TIMEOUT`, `API_URL`.

- **@/types**: Tipagem geral do projeto, interfaces, tipos utilitários e contratos globais. Exemplo: `User`, `ApiResponse`, `ConfigOptions`.

- **@/providers**: Integração com recursos externos ao projeto, como bancos de dados (ex: DuckDB), APIs, serviços de terceiros, autenticação, etc. Cada subdiretório deve conter a implementação e abstração necessária para comunicação com o recurso externo correspondente. **Sempre busque abstrair e encapsular a complexidade desses recursos, fornecendo uma interface simples, desacoplada e fácil de usar para o restante do projeto.**

## 📦 Padronização e Validação de Dependências

- **Nunca instale novas bibliotecas sem consulta prévia ao responsável pelo projeto ou à equipe.**
- O ecossistema do projeto possui um conjunto de libs validadas e padronizadas, escolhidas por critérios de segurança, compatibilidade, manutenção e experiência prévia da equipe.
- Antes de sugerir ou instalar qualquer dependência, verifique:
  - Se já existe uma solução validada para o problema.
  - Se a biblioteca atende aos requisitos de segurança, manutenção e compatibilidade.
  - Se há guidelines ou listas de dependências aprovadas.
- Em caso de necessidade, abra uma issue ou discuta com a equipe antes de propor a instalação.

### Exemplos práticos

- **YAML:**
  - Padrão: `yaml` (já validada e conhecida pela equipe)
  - Não usar: `yaml-js` (não padronizada)

- **Cores no terminal:**
  - Padrão: `colorette` (compatível com CJS e ESM)
  - Não usar: `chalk` (só funciona em ESM, pode causar problemas de compatibilidade)

### Motivos para padronizar

1. **Conhecimento do código:** Bibliotecas já analisadas e testadas pela equipe.
2. **Compatibilidade:** Evita problemas de ambiente e integrações.
3. **Manutenção:** Preferência por libs ativamente mantidas e com comunidade forte.
4. **Consistência:** Facilita manutenção, debugging, onboarding e testes do ecossistema.
5. **Testabilidade:** Padronizar dependências facilita a manutenção dos testes e a confiabilidade do ambiente.

> **Dica:** Se achar válida alguma nova dependência, sempre pergunte antes de instalar. Isso garante a saúde, previsibilidade e segurança do projeto.

## 📏 Regra Fundamental de Consulta ao Guideline

- **Sempre, antes de realizar qualquer tarefa (implementação, refatoração, teste, integração, etc.), consulte o GUIDELINE.md.**
- Verifique se já existe orientação, padrão, exemplo ou restrição relevante para a tarefa.
- Isso garante alinhamento, evita retrabalho, reduz dúvidas e mantém a padronização do projeto.

## 🔄 Princípio Plug-and-Play Slice/ALIVE

- Todo módulo, serviço ou automação do ecossistema Slice/ALIVE deve ser plug-and-play.
- Rodou o comando, tem que funcionar pronto para uso, sem ajustes manuais, configs extras ou dependência de contexto.
- Scripts, checklists e Makefile devem garantir:
  - Criação automática de pastas e permissões
  - Validação incremental e autodiagnóstico
  - Mensagens claras de erro e sucesso
  - Facilidade de restauração/reset
- Se não funcionar plug-and-play, não está pronto para produção Slice/ALIVE.

## ️ Princípio Open/Closed (OCP) e a pasta @/base

### Conceito

- **Open/Closed Principle (OCP)**: "Entidades de software devem estar abertas para extensão, mas fechadas para modificação."
- Em TypeScript, isso é alcançado principalmente através de **classes abstratas** e **herança**.
- A pasta `@/base` serve para definir contratos (interfaces/abstrações) que garantem compatibilidade e padronização entre implementações.

### Como aplicar

1. **Defina contratos claros com classes abstratas**
   - Use `abstract class` para definir métodos obrigatórios e comportamento padrão.
   - Documente quais métodos devem ser sobrescritos e quais podem ser estendidos.

2. **Encapsule detalhes e forneça pontos de extensão**
   - Use `protected` para métodos e propriedades que podem ser sobrescritos/estendidos.
   - Evite `private` se houver possibilidade de override em subclasses.

3. **Mantenha a compatibilidade**
   - Sempre que criar uma nova implementação, siga o contrato da classe abstrata.
   - Isso permite trocar ou adicionar implementações sem alterar o código cliente.

### Exemplo prático

#### 1. Classe Abstrata (Contrato)
```typescript
export abstract class AbstractAIProvider<TOptions = any> {
  protected BEHAVIOR: string = '';
  protected CONTEXT: string = '';

  public setBehavior(behavior: string) { ... }
  public setContext(context: string) { ... }
  protected getSystemPrompt() { ... }

  // Método abstrato: obrigatório sobrescrever
  public abstract generate(options: TOptions): Promise<string>;
}
```

#### 2. Implementação concreta
```typescript
export class OllammaProvider extends AbstractAIProvider<OllammaProviderOptions> {
  public async generate(options: OllammaProviderOptions): Promise<string> {
    // Implementação específica do Ollama
  }
}
```

### Boas práticas para OCP e @/base

- Sempre que precisar garantir compatibilidade futura, crie uma classe abstrata em `@/base`.
- Use `protected` para métodos/propriedades que podem ser sobrescritos.
- Documente cenários de override e extensão.
- Evite `private` se houver chance de extensão futura.
- Registre exemplos e decisões de design no `.cursorrules` da pasta.

### Checklist para aplicar OCP

- [x] Contrato definido em classe abstrata
- [x] Métodos obrigatórios marcados como `abstract`
- [x] Métodos/propriedades de extensão marcados como `protected`
- [x] Documentação de cenários de override
- [x] Implementações concretas seguem o contrato, sem modificar a base

## 🧩 Herança e Composição com Schemas Zod

### Conceito

- Schemas Zod funcionam como "contratos" reutilizáveis e extensíveis, semelhantes a classes abstratas.
- Métodos como `.extend()`, `.pick()`, `.omit()`, `.partial()`, `.required()` permitem criar novos schemas a partir de outros, promovendo reuso, padronização e compatibilidade.
- Isso segue o mesmo princípio do Open/Closed: schemas estão abertos para extensão, mas fechados para modificação.

### Exemplo Prático

```typescript
const BaseUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const AdminUserSchema = BaseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
});

const PartialUserSchema = BaseUserSchema.partial();
```

- `AdminUserSchema` herda todos os campos de `BaseUserSchema` e adiciona novos campos.
- `PartialUserSchema` torna todos os campos opcionais, útil para updates.

### Boas Práticas

- Defina schemas base para entidades principais.
- Use `.extend()` para criar variações sem duplicar código.
- Componha schemas para validação de objetos complexos.
- Documente a hierarquia e relação entre schemas, assim como faria com classes.

### Checklist para Schemas Zod

- [x] Schemas base definidos para entidades principais
- [x] Extensão e composição ao invés de duplicação
- [x] Documentação clara da hierarquia de schemas
- [x] Uso consistente de métodos de herança (`extend`, `pick`, `omit`, etc.)

> **Dica:** Sempre que possível, trate schemas Zod como contratos de validação e extensão, assim como classes abstratas, para garantir compatibilidade, reuso e padronização em todo o projeto.

## 🎯 Programação Funcional

### Princípios

1. **Imutabilidade**:
   ```typescript
   // ❌ Ruim
   const array = [1, 2, 3];
   array.push(4);

   // ✅ Bom
   const array = [1, 2, 3];
   const newArray = [...array, 4];
   ```

2. **Funções Puras**:
   ```typescript
   // ❌ Ruim
   let counter = 0;
   function increment() {
     return ++counter;
   }

   // ✅ Bom
   function increment(n: number): number {
     return n + 1;
   }
   ```

3. **Composição de Funções**:
   ```typescript
   // ❌ Ruim
   const result = processData(validateInput(transformData(input)));

   // ✅ Bom
   const process = flow([
     transformData,
     validateInput,
     processData
   ]);
   const result = process(input);
   ```

### Lodash/FP

1. **Importação**:
   ```typescript
   import * as fp from 'lodash/fp';
   ```

2. **Composição**:
   ```typescript
   const processData = fp.pipe(
     fp.map(x => x * 2),
     fp.filter(x => x > 10),
     fp.sum
   );
   ```

3. **Currying**:
   ```typescript
   const add = fp.curry((a: number, b: number) => a + b);
   const add5 = add(5);
   ```

4. **Transformações**:
   ```typescript
   const transform = fp.pipe(
     fp.pick(['id', 'name']),
     fp.mapKeys(fp.camelCase),
     fp.mapValues(fp.trim)
   );
   ```

5. **Validação**:
   ```typescript
   const isValid = fp.allPass([
     fp.isString,
     fp.complement(fp.isEmpty),
     fp.matches(/^[a-z]+$/)
   ]);
   ```

### Padrões Comuns

1. **Transformação de Dados**:
   ```typescript
   const processUsers = fp.pipe(
     fp.filter(fp.prop('active')),
     fp.map(fp.pick(['id', 'name', 'email'])),
     fp.sortBy('name')
   );
   ```

2. **Validação de Objetos**:
   ```typescript
   const validateUser = fp.allPass([
     fp.has('id'),
     fp.has('name'),
     fp.has('email'),
     fp.flow(fp.get('email'), fp.matches(/^[^@]+@[^@]+\.[^@]+$/))
   ]);
   ```

3. **Manipulação de Arrays**:
   ```typescript
   const processArray = fp.pipe(
     fp.uniq,
     fp.compact,
     fp.sortBy('id'),
     fp.take(10)
   );
   ```

4. **Manipulação de Objetos**:
   ```typescript
   const transformObject = fp.pipe(
     fp.omit(['password', 'secret']),
     fp.mapKeys(fp.camelCase),
     fp.mapValues(fp.toString)
   );
   ```

5. **Composição de Funções Assíncronas**:
   ```typescript
   const processAsync = fp.pipe(
     fp.map(async x => await transform(x)),
     Promise.all,
     fp.filter(fp.identity),
     fp.sortBy('id')
   );
   ```

### Boas Práticas

1. **Use Funções de Ordem Superior**:
   ```typescript
   // ❌ Ruim
   const doubled = [];
   for (const n of numbers) {
     doubled.push(n * 2);
   }

   // ✅ Bom
   const doubled = fp.map(n => n * 2, numbers);
   ```

2. **Evite Mutação**:
   ```typescript
   // ❌ Ruim
   const result = array.sort();

   // ✅ Bom
   const result = fp.sortBy(fp.identity, array);
   ```

3. **Use Composição**:
   ```typescript
   // ❌ Ruim
   const result = processData(validateInput(transformData(input)));

   // ✅ Bom
   const process = fp.pipe(
     transformData,
     validateInput,
     processData
   );
   const result = process(input);
   ```

4. **Use Currying**:
   ```typescript
   // ❌ Ruim
   function add(a: number, b: number) {
     return a + b;
   }
   const add5 = (b: number) => add(5, b);

   // ✅ Bom
   const add = fp.curry((a: number, b: number) => a + b);
   const add5 = add(5);
   ```

5. **Use Point-Free Style**:
   ```typescript
   // ❌ Ruim
   const getNames = (users: User[]) => fp.map(user => user.name, users);

   // ✅ Bom
   const getNames = fp.map(fp.prop('name'));
   ```

### Exemplos de Uso

```typescript
// Processamento de dados
const processData = fp.pipe(
  fp.filter(fp.prop('active')),
  fp.map(fp.pick(['id', 'name', 'email'])),
  fp.sortBy('name'),
  fp.take(10)
);

// Validação de dados
const validateUser = fp.allPass([
  fp.has('id'),
  fp.has('name'),
  fp.has('email'),
  fp.flow(
    fp.get('email'),
    fp.matches(/^[^@]+@[^@]+\.[^@]+$/)
  )
]);

// Transformação de objetos
const transformUser = fp.pipe(
  fp.omit(['password', 'secret']),
  fp.mapKeys(fp.camelCase),
  fp.mapValues(fp.toString)
);

// Composição de funções assíncronas
const processUsers = fp.pipe(
  fp.map(async user => await validateUser(user)),
  Promise.all,
  fp.filter(fp.identity),
  fp.sortBy('id')
);
```

### 🚩 Reforço: Uso obrigatório de lodash/fp

- **Sempre utilize lodash/fp para manipulação funcional de dados.**
- O padrão de importação é:
  ```typescript
  import f from 'lodash/fp'
  ```
- Isso garante imutabilidade, composição, currying e código mais previsível e testável.

#### Exemplos práticos com `f`:

```typescript
import f from 'lodash/fp'

// Filtrar usuários ativos e pegar nomes
def getActiveUserNames = f.flow(
  f.filter({ active: true }),
  f.map('name')
)

// Ordenar por data e pegar os 5 mais recentes
def getRecent = f.flow(
  f.sortBy('createdAt'),
  f.reverse,
  f.take(5)
)

// Compor validação de e-mail
def isValidEmail = f.flow(
  f.get('email'),
  f.isString,
  f.curry((email: string) => /^[^@]+@[^@]+\.[^@]+$/.test(email))
)

// Transformar objeto: camelCase nas chaves e trim nos valores
def cleanObject = f.flow(
  f.mapKeys(f.camelCase),
  f.mapValues(f.trim)
)
```

- **Evite mutação direta, laços for/while e métodos imperativos.**
- Prefira sempre composições com `f.flow`, `f.pipe`, `f.map`, `f.filter`, etc.
- Documente funções utilitárias em `@/utils` e use point-free style sempre que possível.

## 💻 Padrões de Código

### Nomenclatura

- **Arquivos**: kebab-case (ex: `file-utils.ts`)
- **Classes**: PascalCase (ex: `FileProcessor`)
- **Interfaces**: PascalCase com prefixo `I` (ex: `IFileConfig`)
- **Funções/Métodos**: camelCase (ex: `processFile`)
- **Variáveis**: camelCase (ex: `fileContent`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_FILE_SIZE`)

### Formatação

- Indentação: 2 espaços
- Tamanho máximo de linha: 100 caracteres
- Aspas simples para strings
- Ponto e vírgula obrigatório
- Vírgula final em objetos e arrays

### Imports

```typescript
// 1. Imports do Node.js
import fs from 'fs';
import path from 'path';

// 2. Imports de terceiros
import _ from 'lodash';
import axios from 'axios';

// 3. Imports locais
import { FileProcessor } from './file-processor';
import type { IConfig } from './types';
```

## 🎯 Tipagem

### Boas Práticas

1. **Evite `any`**:
   ```typescript
   // ❌ Ruim
   function process(data: any): any {}

   // ✅ Bom
   function process<T>(data: T): T {}
   ```

2. **Use Type Guards**:
   ```typescript
   function isValidString(value: unknown): value is string {
     return typeof value === 'string' && value.trim().length > 0;
   }
   ```

3. **Interfaces vs Types**:
   - Use `interface` para objetos que podem ser estendidos
   - Use `type` para unions, intersections e aliases

4. **Generics**:
   ```typescript
   interface IProcessor<T> {
     process(data: T): Promise<T>;
   }
   ```

### 🚩 Preferência por Zod em vez de interface para contratos de dados

- Sempre que possível, **prefira definir contratos de dados usando Zod** ao invés de apenas interfaces TypeScript.
- Zod permite validação em tempo de execução, composição, extensão e integração direta com APIs, bancos de dados e serialização.
- Interfaces TypeScript só existem em tempo de desenvolvimento e não garantem validação real dos dados em produção.

#### Exemplo prático:

```typescript
// ❌ Interface (apenas tipagem, sem validação em runtime)
interface User {
  id: string
  name: string
  email?: string
}

// ✅ Zod Schema (tipagem + validação em runtime)
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
})

// Uso: validação e inferência de tipo
const user = UserSchema.parse(input)
type User = z.infer<typeof UserSchema>
```

- **Vantagens de Zod:**
  - Validação automática de dados recebidos de APIs, arquivos, bancos, etc.
  - Composição e extensão fácil de schemas.
  - Geração automática de tipos TypeScript a partir do schema.
  - Redução de bugs e maior segurança em produção.

> **Dica:** Use interfaces apenas para contratos de comportamento (ex: classes, métodos), e Zod para contratos de dados.

## 🚨 Tratamento de Erros

### Padrão de Erros

```typescript
try {
  // Operação
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`Operação falhou: ${message}`);
}
```

### Validação de Input

```typescript
function processFile(filePath: string): void {
  if (!isValidPath(filePath)) {
    throw new Error('Caminho de arquivo inválido');
  }
  // ...
}
```

## ⚡ Performance

### Otimizações

1. **Operações Assíncronas**:
   - Use `Promise.all` para operações paralelas
   - Evite callbacks aninhados
   - Use async/await para melhor legibilidade

2. **Manipulação de Strings**:
   - Use template literals
   - Evite concatenação em loops
   - Use `StringBuilder` para grandes strings

3. **Operações de Arquivo**:
   - Use streams para arquivos grandes
   - Feche recursos adequadamente
   - Use buffers apropriadamente

## 🔒 Segurança

### Boas Práticas

1. **Validação de Input**:
   - Sempre valide dados de entrada
   - Use sanitização de strings
   - Escape caracteres especiais

2. **Manipulação de Arquivos**:
   - Valide caminhos de arquivo
   - Use permissões adequadas
   - Evite operações síncronas em produção

3. **Comandos Shell**:
   - Escape argumentos de comando
   - Valide comandos antes de executar
   - Use timeout em operações assíncronas

## 🧪 Testes

### Padrões

1. **Estrutura**:
   ```typescript
   describe('FileProcessor', () => {
     it('should process file correctly', async () => {
       // Arrange
       // Act
       // Assert
     });
   });
   ```

2. **Cobertura**:
   - Mínimo de 80% de cobertura
   - Teste casos de erro
   - Teste edge cases

3. **Mocks**:
   - Use mocks para I/O
   - Simule erros
   - Teste timeouts

## 📝 Documentação

### JSDoc

```typescript
/**
 * Processa um arquivo e retorna seu conteúdo.
 * @param filePath - Caminho do arquivo
 * @throws {Error} Se o arquivo não existir ou não puder ser lido
 * @returns Conteúdo do arquivo
 */
async function processFile(filePath: string): Promise<string> {
  // ...
}
```

### Comentários

- Use comentários para explicar "por quê", não "o quê"
- Documente decisões de design
- Mantenha comentários atualizados

## 🔄 Fluxo de Trabalho

### Desenvolvimento

1. **Setup**:
   ```bash
   pnpm install
   ```

2. **Desenvolvimento**:
   ```bash
   pnpm dev
   ```

## 🎭 Padrão Facade

### Conceito

O padrão Facade (Fachada) é uma técnica de abstração que simplifica a interface de um subsistema complexo, fornecendo uma interface unificada e de alto nível. Este padrão é aplicado tanto em providers quanto em classes de lib.

### Princípios

1. **Simplificação**
   - Interface única e coesa
   - Ocultação de complexidade
   - Redução de acoplamento

2. **Encapsulamento**
   - Detalhes de implementação privados
   - API pública simplificada
   - Gerenciamento interno de recursos

3. **Coesão**
   - Responsabilidade única
   - Métodos relacionados agrupados
   - Interface intuitiva

### Exemplos de Implementação

1. **Provider (DuckDB)**
   ```typescript
   // Complexidade interna
   class DuckDBAdapter {
     private connection: Connection;
     private queryBuilder: QueryBuilder;
     private typeMapper: TypeMapper;

     // Interface simplificada
     async query<T>(sql: string): Promise<T[]> {
       // Internamente:
       // 1. Valida SQL
       // 2. Mapeia tipos
       // 3. Executa query
       // 4. Trata erros
       // 5. Formata resultado
       return this.connection.execute(sql);
     }
   }
   ```

2. **Lib (FileProcessor)**
   ```typescript
   // Complexidade interna
   class FileProcessor {
     private fileSystem: FileSystem;
     private validator: FileValidator;
     private transformer: DataTransformer;

     // Interface simplificada
     async processFile(path: string): Promise<ProcessedData> {
       // Internamente:
       // 1. Valida arquivo
       // 2. Lê conteúdo
       // 3. Transforma dados
       // 4. Valida resultado
       // 5. Retorna formato padronizado
       return this.fileSystem.read(path);
     }
   }
   ```

3. **Lib (HttpClient)**
   ```typescript
   // Complexidade interna
   class HttpClient {
     private requestBuilder: RequestBuilder;
     private responseParser: ResponseParser;
     private errorHandler: ErrorHandler;

     // Interface simplificada
     async get<T>(url: string): Promise<T> {
       // Internamente:
       // 1. Constrói request
       // 2. Adiciona headers
       // 3. Trata timeouts
       // 4. Parse resposta
       // 5. Trata erros
       return this.requestBuilder.build(url);
     }
   }
   ```

### Boas Práticas

1. **Design da Interface**
   ```typescript
   class ComplexSystem {
     // ❌ Ruim: Expõe complexidade
     async process(
       data: any,
       options: {
         validate: boolean;
         transform: boolean;
         cache: boolean;
         retry: number;
         timeout: number;
       }
     ) { ... }

     // ✅ Bom: Interface simplificada
     async process(data: any): Promise<Result> {
       // Complexidade interna
       return this.internalProcess(data);
     }
   }
   ```

2. **Gerenciamento de Estado**
   ```typescript
   class SystemFacade {
     // ❌ Ruim: Estado exposto
     public connection: Connection;
     public config: Config;
     public cache: Cache;

     // ✅ Bom: Estado encapsulado
     private connection: Connection;
     private config: Config;
     private cache: Cache;

     // Interface limpa
     async initialize(): Promise<void> {
       // Complexidade interna
     }
   }
   ```

3. **Tratamento de Erros**
   ```typescript
   class SystemFacade {
     // ❌ Ruim: Erros expostos
     async process(): Promise<void> {
       try {
         await this.validate();
         await this.transform();
         await this.save();
       } catch (error) {
         throw error; // Expõe complexidade
       }
     }

     // ✅ Bom: Erros encapsulados
     async process(): Promise<void> {
       try {
         await this.internalProcess();
       } catch (error) {
         throw new SystemError('Falha no processamento', error);
       }
     }
   }
   ```

### Checklist de Implementação

- [ ] Interface pública simples e intuitiva
- [ ] Complexidade encapsulada internamente
- [ ] Gerenciamento de recursos automático
- [ ] Tratamento de erros unificado
- [ ] Documentação clara da API pública
- [ ] Testes da interface pública
- [ ] Exemplos de uso

### Benefícios

1. **Manutenibilidade**
   - Código mais organizado
   - Mudanças internas não afetam clientes
   - Facilidade de debug

2. **Usabilidade**
   - API intuitiva
   - Menos código para usar
   - Menos erros de uso

3. **Testabilidade**
   - Interface clara para mocks
   - Testes mais focados
   - Cobertura mais efetiva

> **Dica:** Ao criar uma nova classe, sempre pense em como simplificar sua interface pública, encapsulando a complexidade interna.

## 🧪 Organização de Testes Unitários

- Todos os testes unitários devem ser criados na mesma pasta do arquivo testado, dentro de um subdiretório chamado `__tests__`.
- Exemplo:
  - Para `src/lib/MemoryVectorIndex.ts`, os testes devem ficar em `src/lib/__tests__/MemoryVectorIndex.test.ts`.
- Isso facilita a manutenção, descoberta e execução dos testes, mantendo o projeto organizado e alinhado ao padrão adotado.

### Exemplos Avançados com lodash/fp

```typescript
import f from 'lodash/fp'

// Agrupar usuários por status
const groupByStatus = f.groupBy('status')

// Remover duplicados por id
const uniqueById = f.uniqBy('id')

// Atualizar um campo em todos os objetos
const setAllActive = f.map(f.set('active', true))

// Filtrar, mapear e ordenar em uma linha
const process = f.flow(
  f.filter({ active: true }),
  f.map(f.pick(['id', 'name', 'email'])),
  f.sortBy('name')
)

// Composição assíncrona
const processUsers = f.flow(
  f.map(async user => await validateUser(user)),
  Promise.all,
  f.filter(Boolean),
  f.sortBy('id')
)

// Point-free: extrair todos os e-mails válidos
const getValidEmails = f.flow(
  f.map('email'),
  f.filter(Boolean),
  f.uniq
)
```

### Exemplos Avançados com Zod

```typescript
import { z } from 'zod'

// Schema base
const BaseUser = z.object({
  id: z.string(),
  name: z.string(),
})

// Extensão para admin
const AdminUser = BaseUser.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
})

// Schema parcial para updates
const PartialUser = BaseUser.partial()

// Composição de schemas
const Team = z.object({
  name: z.string(),
  members: z.array(BaseUser),
})

// Validação de arrays e objetos aninhados
const Product = z.object({
  id: z.string(),
  name: z.string(),
  tags: z.array(z.string()).min(1),
  metadata: z.record(z.string(), z.any()),
})
const ProductList = z.array(Product)

// Refinamento e customização
const Password = z.string().min(8).refine(
  val => /[A-Z]/.test(val),
  { message: 'Deve conter ao menos uma letra maiúscula' }
)
const UserWithPassword = BaseUser.extend({
  password: Password,
})

// Inferência de tipos
// type Admin = z.infer<typeof AdminUser>
// type TeamType = z.infer<typeof Team>
```

### Exemplo Integrado: lodash/fp + Zod

```typescript
import f from 'lodash/fp'
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  active: z.boolean(),
})

// Validar e extrair nomes de usuários ativos
const getActiveNames = f.flow(
  f.filter(user => UserSchema.safeParse(user).success && user.active),
  f.map('name')
)
```

## 🌐 Interoperabilidade: Zod e JSON Schema para Python e outros stacks

- O uso de Zod como padrão para contratos de dados permite exportar schemas para JSON Schema, um formato amplamente suportado em diversas linguagens, especialmente Python (ex: Pydantic, Marshmallow, FastAPI).
- Isso garante que o mesmo contrato de dados pode ser validado e consumido tanto em TypeScript quanto em Python, reduzindo bugs e divergências entre serviços.
- Facilita a geração automática de documentação, integração de APIs, geração de mocks e automação de validação cross-stack.

#### Exemplo prático de exportação e consumo:

```typescript
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

// Exportar para JSON Schema
const userJsonSchema = zodToJsonSchema(UserSchema)
console.log(JSON.stringify(userJsonSchema, null, 2))
```

Esse JSON Schema pode ser consumido diretamente em Python:

```python
from pydantic import BaseModel

class User(BaseModel):
    id: str
    name: str
    email: str
```

Ou validado dinamicamente com bibliotecas como `jsonschema`.

> **Resumo:** Adotar Zod como padrão fortalece a validação em TypeScript e garante interoperabilidade real com Python e outros stacks, tornando o Slice/ALIVE mais flexível, escalável e pronto para integrações heterogêneas.
