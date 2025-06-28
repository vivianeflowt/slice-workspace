# 📈 Diagrama de Ciclos e Dimensões — Slice/ALIVE

Este arquivo documenta todos os ciclos possíveis do fluxo Slice/ALIVE em relação às principais dimensões colaborativas: afinidade, reputação técnica, ruído, hierarquia e entrega.

---

## 🟦 Diagrama Mermaid

```mermaid
flowchart TD
    subgraph Dimensões
        A["Afinidade"]
        B["Reputação Técnica"]
        C["Ruído"]
        D["Hierarquia"]
        E["Entrega/Task"]
    end

    subgraph Ciclos
        F["Ciclo de Alinhamento"]
        G["Ciclo de Loop/Travamento"]
        H["Ciclo de Feedback"]
        I["Ciclo de Destravamento"]
        J["Ciclo de Aprendizado"]
        K["Ciclo de Escalada"]
        L["Ciclo de Substituição"]
        M["Ciclo de Auto-balanceamento"]
    end

    %% Relações entre ciclos e dimensões
    F --> A
    F --> B
    F --> D
    F --> E
    G --> C
    G --> A
    G --> B
    H --> A
    H --> B
    H --> C
    I --> E
    I --> D
    I --> B
    J --> A
    J --> B
    J --> D
    J --> E
    K --> D
    K --> B
    K --> E
    L --> B
    L --> E
    L --> D
    M --> A
    M --> B
    M --> C
    M --> D
    M --> E

    %% Ciclos podem se retroalimentar
    G -- "loop detectado" --> H
    H -- "feedback recebido" --> I
    I -- "task destravada" --> J
    J -- "aprendizado registrado" --> F
    G -- "loop persiste" --> K
    K -- "escalada não resolve" --> L
    L -- "modelo/role substituído" --> M
    M -- "sistema reequilibrado" --> F
    M -- "ruído persiste" --> G

    %% Observação
    classDef blue fill:#b3e6ff,stroke:#333,stroke-width:2px;
    classDef green fill:#b6fcb6,stroke:#333,stroke-width:2px;
    classDef yellow fill:#fffcb6,stroke:#333,stroke-width:2px;
    classDef red fill:#ffb6b6,stroke:#333,stroke-width:2px;
    class A,B,D,E blue;
    class C yellow;
    class F,J,M green;
    class G,L red;
    class H,I,K yellow;
```

---

## 🟩 Legenda
- **Azul:** Dimensões principais do fluxo.
- **Verde:** Ciclos positivos (alinhamento, aprendizado, auto-balanceamento).
- **Amarelo:** Ciclos de alerta (feedback, destravamento, escalada).
- **Vermelho:** Ciclos críticos (loop, substituição).

## 📝 Explicação
Cada ciclo impacta diferentes dimensões do fluxo Slice/ALIVE. O sistema é desenhado para retroalimentar, aprender e se auto-balancear, garantindo evolução contínua, destravamento rápido e registro auditável de todos os eventos colaborativos.
