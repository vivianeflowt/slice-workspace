import { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Dropdown } from '../../../components/ui/Dropdown/Dropdown';
import { Input } from '../../../components/ui/Input/Input';
import { Tabs } from '../../../components/ui/Tabs/Tabs';

/**
 * Janela principal de chat.
 * Estrutura base: header, área de mensagens e input.
 * Pronta para evoluir com integração backend e UI/UX amigável.
 */
// Mock inicial de providers e modelos (pode ser substituído por dados do backend futuramente)
const PROVIDERS = [
  {
    name: 'OpenAI',
    models: [
      { id: 'gpt-4', label: 'GPT-4', desc: 'Modelo LLM da OpenAI, ótimo para tarefas gerais.' },
      { id: 'gpt-3.5', label: 'GPT-3.5', desc: 'Modelo rápido e econômico da OpenAI.' },
    ],
  },
  {
    name: 'DeepSeek',
    models: [
      {
        id: 'deepseek-coder',
        label: 'DeepSeek Coder',
        desc: 'Especializado em código e reasoning.',
      },
    ],
  },
  {
    name: 'Ollama',
    models: [
      {
        id: 'llama2',
        label: 'Llama 2',
        desc: 'Modelo open-source, bom para experimentação local.',
      },
    ],
  },
];
const TABS = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

export const ChatWindow = () => {
  const [activeTab, setActiveTab] = useState('tab2');
  const [provider, setProvider] = useState(PROVIDERS[0].name);
  const [model, setModel] = useState(PROVIDERS[0].models[0].id);
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  // Models disponíveis para o provider selecionado
  const currentProvider = PROVIDERS.find((p) => p.name === provider)!;
  const models = currentProvider.models;
  const selectedModel = models.find((m) => m.id === model) || models[0];

  // Atualiza modelo ao trocar de provider
  const handleProviderChange = (prov: string) => {
    setProvider(prov);
    const firstModel = PROVIDERS.find((p) => p.name === prov)?.models[0];
    setModel(firstModel?.id || '');
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Tabs laterais */}
      <aside
        style={{
          minWidth: 80,
          background: '#181A20',
          padding: '0.5rem 0',
          borderRight: '1px solid #222',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </aside>
      {/* Área principal do chat */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#181A20' }}>
        {/* Header: dropdowns de provider/modelo e tooltip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0.5rem 1rem',
            borderBottom: '1px solid #222',
            background: '#20222a',
            position: 'relative',
          }}
        >
          <Dropdown
            options={PROVIDERS.map((p) => ({ label: p.name, value: p.name }))}
            value={provider}
            onChange={handleProviderChange}
          />
          <Dropdown
            options={models.map((m) => ({ label: m.label, value: m.id }))}
            value={model}
            onChange={setModel}
          />
          <span
            tabIndex={0}
            aria-label={`Sobre o modelo ${selectedModel.label}`}
            title={selectedModel.desc}
            style={{
              color: '#4af',
              cursor: 'pointer',
              fontSize: 18,
              outline: 'none',
              position: 'relative',
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
          >
            ?
            {showTooltip && (
              <div
                style={{
                  position: 'absolute',
                  top: 28,
                  left: 0,
                  background: '#23272f',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px #0008',
                  zIndex: 10,
                  minWidth: 220,
                  fontSize: 14,
                }}
                role="tooltip"
              >
                <strong>{selectedModel.label}</strong>: {selectedModel.desc}
              </div>
            )}
          </span>
        </div>
        {/* Área de mensagens */}
        <div
          style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            color: '#bbb',
            background: '#181A20',
          }}
        >
          Nenhuma mensagem ainda.
        </div>
        {/* Input e controles */}
        <form
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0.5rem 1rem',
            borderTop: '1px solid #222',
            background: '#20222a',
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type="text"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ flex: 1 }}
            disabled
          />
          <Button type="button" variant="secondary" style={{ minWidth: 120 }} disabled>
            MICROFONE
          </Button>
          <Button type="submit" variant="primary" style={{ minWidth: 80 }} disabled>
            Enviar
          </Button>
        </form>
      </section>
    </div>
  );
};
