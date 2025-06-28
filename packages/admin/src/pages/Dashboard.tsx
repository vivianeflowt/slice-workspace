import React, { useState, useEffect, useRef } from 'react';
import VoiceRecorder from '../components/ui/VoiceRecorder/Component';
import { useApi } from '../hooks/useApi';
import axios from 'axios';
import { FaRobot, FaServer, FaCogs, FaTasks, FaArrowRight, FaTimes, FaRegCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './DashboardMarkdownHighlight.css';
import MarkdownBox from '../components/ui/MarkdownBox';

const BEHAVIORS = [
  {
    key: 'GENERIC',
    label: 'GENERIC',
    content: '',
    description:
      'GENERIC: Modo padrão, sem contexto extra. Tudo é interpretado literalmente, sem sub prompt adicional.',
    color: 'bg-[#101624] text-white',
  },
  {
    key: 'PROJECT',
    label: 'PROJECT',
    content: `Tudo que for detalhado enquanto este behavior estiver ativo deve ser registrado fielmente no PROJECT.md.`,
    description:
      'PROJECT: Tudo que for detalhado enquanto este behavior estiver ativo deve ser registrado fielmente no PROJECT.md.',
    color: 'bg-black text-white',
  },
  {
    key: 'BEHAVIOR',
    label: 'BEHAVIOR',
    content: `Use este behavior para definir como a IA deve se comportar. Exemplo: ser mais crítica, questionadora, proativa, comunicativa ou seguir regras específicas de execução.`,
    description: 'BEHAVIOR: Define como a IA deve se comportar (crítica, proativa, etc).',
    color: 'bg-black text-white',
  },
  {
    key: 'CONTEXT',
    label: 'CONTEXT',
    content: `Use este behavior quando quiser mudar completamente o foco ou contexto do trabalho.`,
    description: 'CONTEXT: Muda completamente o foco/contexto do trabalho.',
    color: 'bg-black text-white',
  },
  {
    key: 'FEEDBACK',
    label: 'FEEDBACK',
    content: `Use este behavior para dar instruções diretas, correções ou pedidos de ajuste.`,
    description:
      'FEEDBACK: Para comandos diretos, correções ou ajustes. IA executa exatamente o que for solicitado.',
    color: 'bg-black text-white',
  },
];

const getButtonClass = (active: boolean, color: string) =>
  `w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
    active
      ? `${
          color === 'green'
            ? 'border-green-600 bg-green-900'
            : color === 'blue'
              ? 'border-blue-400 bg-[#23272e]'
              : color === 'yellow'
                ? 'border-yellow-400 bg-[#23272e]'
                : 'border-[#31343b] bg-[#181c23]'
        } shadow-lg`
      : 'border-[#31343b] bg-[#181c23]'
  }`;

const Dashboard: React.FC = () => {
  const [text, setText] = useState('');
  const { loading, error, request } = useApi('/api/send_to_chat');
  const [success, setSuccess] = useState(false);
  const [behavior, setBehavior] = useState('GENERIC');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activePage, setActivePage] = useState<'ia' | 'model' | 'server-ia'>('ia');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [modelResponse, setModelResponse] = useState('');
  const [serverSystemPrompt, setServerSystemPrompt] = useState('');
  const [serverInput, setServerInput] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isMd, setIsMd] = useState(false);
  const [autoSendTranscription, setAutoSendTranscription] = useState(false);

  useEffect(() => {
    if (success) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSuccess(false), 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [success]);

  useEffect(() => {
    if (activePage === 'model' && models.length === 0) {
      axios.get('/api/models').then((res) => {
        setModels(res.data.models || []);
        setSelectedModel(res.data.models?.[0] || '');
      });
    }
  }, [activePage]);

  const handleTranscription = (transcribed: string) => {
    setText(transcribed);
    setSuccess(false);
    if (autoSendTranscription) {
      setInput((prev) => (prev ? prev.trim() + '\n' + transcribed : transcribed));
      setIsMd(/^\s*(#|[-*]|\d+\.)/.test(transcribed));
    } else {
      setInput(transcribed);
      setIsMd(/^\s*(#|[-*]|\d+\.)/.test(transcribed));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    setIsMd(/^\s*(#|[-*]|\d+\.)/.test(value));
  };

  const handleBehaviorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBehavior(e.target.value);
    setAutoSendTranscription(false);
  };

  const handleSend = () => {
    setSuccess(false);
    const behaviorObj = BEHAVIORS.find((b) => b.key === behavior);
    const finalText =
      behavior !== 'GENERIC' && behaviorObj?.content
        ? `${input}\n\n:::\n${behaviorObj.content}\n:::`
        : input;
    request({ method: 'POST', body: { text: finalText } })
      .then(() => {
        setSuccess(true);
        setInput('');
        setText('');
      })
      .catch(() => setSuccess(false));
  };

  const handleModelSend = async () => {
    if (!selectedModel || !modelInput) return;
    setModelResponse('');
    const res = await axios.post('/api/ask', {
      model: selectedModel,
      prompt: modelInput,
    });
    setModelResponse(res.data.response || '');
  };

  const handleServerIASend = async () => {
    if (!serverInput) return;
    setServerResponse('');
    const res = await axios.post('/api/server-ia', {
      systemPrompt: serverSystemPrompt,
      prompt: serverInput,
    });
    setServerResponse(res.data.response || '');
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1d21] transition-colors flex flex-col">
      {/* Top bar fixa */}
      <div
        className="w-full flex justify-center items-center gap-8 py-3 px-4 bg-[#181c23] border-b border-[#23272e] fixed top-0 left-0 z-50"
        style={{ height: '64px' }}
      >
        <div className="flex justify-center w-full gap-6">
          <div className="relative group">
            <button
              className={getButtonClass(activePage === 'ia', 'green')}
              onClick={() => setActivePage('ia')}
              title="Interagir com IA (Behavior)"
            >
              <FaRobot
                className={activePage === 'ia' ? 'text-green-400' : 'text-gray-400'}
                size={20}
              />
            </button>
            <span className="absolute mt-2 text-xs text-gray-300 transition -translate-x-1/2 opacity-0 pointer-events-none left-1/2 group-hover:opacity-100">
              IA (Behavior)
            </span>
          </div>
          <div className="relative group">
            <button
              className={getButtonClass(activePage === 'model', 'blue')}
              onClick={() => setActivePage('model')}
              title="Modelos do Servidor"
            >
              <FaCogs
                className={activePage === 'model' ? 'text-blue-400' : 'text-gray-400'}
                size={20}
              />
            </button>
            <span className="absolute mt-2 text-xs text-gray-300 transition -translate-x-1/2 opacity-0 pointer-events-none left-1/2 group-hover:opacity-100">
              Modelos
            </span>
          </div>
          <div className="relative group">
            <button
              className={getButtonClass(activePage === 'server-ia', 'yellow')}
              onClick={() => setActivePage('server-ia')}
              title="IA do Servidor Principal"
            >
              <FaServer
                className={activePage === 'server-ia' ? 'text-yellow-400' : 'text-gray-400'}
                size={20}
              />
            </button>
            <span className="absolute mt-2 text-xs text-gray-300 transition -translate-x-1/2 opacity-0 pointer-events-none left-1/2 group-hover:opacity-100">
              IA Servidor
            </span>
          </div>
          <div className="relative group">
            <button
              className={getButtonClass(window.location.pathname === '/tasks', 'green')}
              onClick={() => navigate('/tasks')}
              title="Gestão de Tasks"
            >
              <FaTasks
                className={
                  window.location.pathname === '/tasks' ? 'text-green-300' : 'text-blue-300'
                }
                size={20}
              />
            </button>
            <span className="absolute mt-2 text-xs text-gray-300 transition -translate-x-1/2 opacity-0 pointer-events-none left-1/2 group-hover:opacity-100">
              Gestão de Tasks
            </span>
          </div>
        </div>
      </div>
      {/* Espaço para a top bar */}
      <div style={{ height: '64px' }} />
      {/* Conteúdo central */}
      <div className="flex items-start justify-center flex-1 w-full">
        <div
          className="bg-[#23272e] shadow-2xl rounded-xl p-8 mt-8 border-t-4 border-[#31343b] resize overflow-auto flex flex-col"
          style={{
            minWidth: 320,
            minHeight: 320,
            maxWidth: '100vw',
            maxHeight: '80vh',
            width: 600,
            height: 600,
          }}
        >
          {/* Conteúdo das páginas */}
          {activePage === 'ia' ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <VoiceRecorder onTranscription={handleTranscription} />
              </div>
              <div className="flex items-center justify-between w-full gap-2 mb-4">
                <select
                  className="form-select w-40 min-w-[10rem] max-w-[12rem] text-left"
                  value={behavior}
                  onChange={handleBehaviorChange}
                >
                  {BEHAVIORS.map((b) => (
                    <option
                      key={b.key}
                      value={b.key}
                      className={b.key !== behavior ? 'font-bold' : ''}
                      style={
                        b.key === 'GENERIC'
                          ? {
                              color: '#0000ff',
                              fontWeight: b.key !== behavior ? 'bold' : 'normal',
                              background: '#fff',
                            }
                          : {
                              color: '#000',
                              fontWeight: b.key !== behavior ? 'bold' : 'normal',
                              background: '#fff',
                            }
                      }
                      title={b.description}
                    >
                      {b.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAutoSendTranscription((v) => !v)}
                  className={`p-1 rounded-full transition-colors focus:outline-none ${autoSendTranscription ? 'bg-blue-600 text-white' : 'bg-gray-500 text-white'}`}
                  title={autoSendTranscription ? 'Adicionar gravações (concatena)' : 'Sobrescrever textbox'}
                  style={{ minWidth: 28, minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <FaRegCommentDots size={14} />
                </button>
              </div>
              {BEHAVIORS.find((b) => b.key === behavior)?.description && (
                <div
                  className="flex items-center justify-center w-full mb-2 text-xs text-center text-gray-400"
                  style={{ marginTop: '-0.5rem' }}
                >
                  <span className="mx-auto">
                    {BEHAVIORS.find((b) => b.key === behavior)?.description}
                  </span>
                </div>
              )}
              <textarea
                value={input}
                onChange={handleInputChange}
                rows={12}
                className={`flex-1 min-h-[120px] max-h-full rounded-lg p-3 mb-4 bg-[#23272e] text-gray-100 border border-[#31343b] focus:border-[#31343b] active:border-[#31343b] hover:border-[#31343b] disabled:border-[#31343b] focus:ring-2 focus:ring-green-400 shadow-none placeholder-gray-400 outline-none resize-none${isMd ? ' md-syntax-highlight' : ''}`}
                style={{ boxShadow: 'none', outline: 'none' }}
                placeholder="Texto transcrito aparecerá aqui..."
              />
              <div className="mt-4">
                <button
                  onClick={handleSend}
                  className="py-3 btn btn-success w-100 fw-bold fs-5"
                  disabled={!input.trim() || loading}
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR'}
                </button>
                {success && (
                  <div className="mt-2 text-center text-green-400">Enviado com sucesso!</div>
                )}
                {error && (
                  <div className="mt-2 text-center text-red-400">Erro ao enviar: {error}</div>
                )}
              </div>
            </>
          ) : activePage === 'model' ? (
            <div className="bg-[#23272e] p-6 rounded-b-lg border border-[#31343b]">
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-200">Modelo de IA</label>
                <select
                  className="mb-2 form-select w-60"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                rows={8}
                className="w-full min-h-[120px] rounded-lg p-3 mb-4 bg-[#23272e] text-gray-100 border border-[#31343b] focus:ring-2 focus:ring-blue-400 shadow-none placeholder-gray-400 outline-none resize-y"
                placeholder="Digite o prompt para o modelo selecionado..."
              />
              <button
                className="px-4 py-2 font-bold text-white transition bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleModelSend}
              >
                Enviar para Modelo
              </button>
              {modelResponse && (
                <div className="mt-6">
                  <ReactMarkdown>{modelResponse}</ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#23272e] p-6 rounded-b-lg border border-[#31343b]">
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-200">
                  System Prompt (opcional)
                </label>
                <textarea
                  value={serverSystemPrompt}
                  onChange={(e) => setServerSystemPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg p-2 mb-2 bg-[#23272e] text-gray-100 border border-[#31343b] focus:ring-2 focus:ring-yellow-400 shadow-none placeholder-gray-400 outline-none resize-y"
                  placeholder="Defina um system prompt customizado para a IA do servidor principal..."
                />
              </div>
              <textarea
                value={serverInput}
                onChange={(e) => setServerInput(e.target.value)}
                rows={8}
                className="w-full min-h-[120px] rounded-lg p-3 mb-4 bg-[#23272e] text-gray-100 border border-[#31343b] focus:ring-2 focus:ring-yellow-400 shadow-none placeholder-gray-400 outline-none resize-y"
                placeholder="Digite o prompt para a IA do servidor principal..."
              />
              <button
                className="px-4 py-2 font-bold text-white transition bg-yellow-500 rounded hover:bg-yellow-600"
                onClick={handleServerIASend}
              >
                Enviar para IA do Servidor
              </button>
              {serverResponse && (
                <div className="mt-6">
                  <ReactMarkdown>{serverResponse}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
