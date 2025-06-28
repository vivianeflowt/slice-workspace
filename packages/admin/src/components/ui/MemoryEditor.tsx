import React, { useState } from 'react';
// @ts-ignore
import { Memory } from 'mem0ai/oss';

const memory = new Memory();

const MemoryEditor: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [query, setQuery] = useState('');
  const [memories, setMemories] = useState<any[]>([]);
  const [newMemory, setNewMemory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const result = await memory.search(query, { userId });
    setMemories(result?.results || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    setLoading(true);
    await memory.add(newMemory, { userId });
    setNewMemory('');
    await handleSearch();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await memory.delete(id);
    await handleSearch();
    setLoading(false);
  };

  return (
    <div style={{ background: '#23272e', color: '#fff', padding: 16, borderRadius: 8, minHeight: 300 }}>
      <h2>Editor de Memória (mem0)</h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Buscar memórias..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleSearch} disabled={loading}>Buscar</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Nova memória..."
          value={newMemory}
          onChange={e => setNewMemory(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleAdd} disabled={loading || !newMemory}>Adicionar</button>
      </div>
      {loading && <div>Carregando...</div>}
      <ul>
        {memories.map((m: any) => (
          <li key={m.id} style={{ marginBottom: 4 }}>
            <span>{m.memory}</span>
            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(m.id)} disabled={loading}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryEditor;
