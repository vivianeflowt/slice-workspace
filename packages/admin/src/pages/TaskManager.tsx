import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  file: string;
  title: string;
  category: string;
  priority: string;
  habilidade?: string;
  description?: string;
}

const emptyTask: Omit<Task, 'file'> = {
  title: '',
  category: '',
  priority: '',
  habilidade: '',
  description: '',
};

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formTask, setFormTask] = useState<Omit<Task, 'file'>>(emptyTask);
  const [editFile, setEditFile] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [validating, setValidating] = useState<string | null>(null);

  const fetchTasks = () => {
    setLoading(true);
    axios
      .get('/api/tasks')
      .then((res) => {
        setTasks(res.data.tasks || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormTask({ ...formTask, [e.target.name]: e.target.value });
  };

  const handleNew = () => {
    setFormTask(emptyTask);
    setEditFile(null);
    setShowForm(true);
    setFeedback(null);
  };

  const handleEdit = (task: Task) => {
    setFormTask({
      title: task.title,
      category: task.category,
      priority: task.priority,
      habilidade: task.habilidade || '',
      description: task.description || '',
    });
    setEditFile(task.file);
    setShowForm(true);
    setFeedback(null);
  };

  const handleDelete = (file: string) => {
    if (!window.confirm('Deseja realmente deletar esta task?')) return;
    axios
      .delete(`/api/tasks/${file}`)
      .then(() => {
        setFeedback('Task deletada com sucesso!');
        fetchTasks();
      })
      .catch((err) => setFeedback('Erro ao deletar: ' + err.message));
  };

  const handleValidate = (file: string) => {
    setValidating(file);
    axios
      .post(`/api/tasks/validate/${file}`)
      .then((res) => {
        setFeedback(res.data.valid ? 'Task válida!' : 'Inválida: ' + (res.data.reason || ''));
        setValidating(null);
      })
      .catch((err) => {
        setFeedback('Erro ao validar: ' + err.message);
        setValidating(null);
      });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const method = editFile ? 'put' : 'post';
    const url = editFile ? `/api/tasks/${editFile}` : '/api/tasks';
    axios[method](url, formTask)
      .then(() => {
        setFeedback(editFile ? 'Task atualizada!' : 'Task criada!');
        setShowForm(false);
        fetchTasks();
      })
      .catch((err) => setFeedback('Erro: ' + (err.response?.data?.detail || err.message)));
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1d21] flex flex-col items-center py-10">
      <div className="bg-[#23272e] shadow-2xl rounded-xl p-8 border-t-4 border-[#31343b] w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-6">Gestão de Tasks Markdown</h1>
        {feedback && <div className="mb-4 text-sm text-blue-300">{feedback}</div>}
        <div className="mb-4 flex gap-2">
          <button
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
            onClick={handleNew}
          >
            Novo
          </button>
        </div>
        {showForm && (
          <form className="mb-6 bg-[#181c23] p-4 rounded-lg" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="title"
                value={formTask.title}
                onChange={handleInputChange}
                placeholder="Título"
                required
                className="p-2 rounded bg-[#23272e] text-white"
              />
              <input
                name="category"
                value={formTask.category}
                onChange={handleInputChange}
                placeholder="Categoria"
                required
                className="p-2 rounded bg-[#23272e] text-white"
              />
              <input
                name="priority"
                value={formTask.priority}
                onChange={handleInputChange}
                placeholder="Prioridade (alta, média, baixa)"
                required
                className="p-2 rounded bg-[#23272e] text-white"
              />
              <input
                name="habilidade"
                value={formTask.habilidade}
                onChange={handleInputChange}
                placeholder="Habilidade (opcional)"
                className="p-2 rounded bg-[#23272e] text-white"
              />
              <textarea
                name="description"
                value={formTask.description}
                onChange={handleInputChange}
                placeholder="Descrição (opcional)"
                className="col-span-2 p-2 rounded bg-[#23272e] text-white"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
              >
                {editFile ? 'Salvar' : 'Criar'}
              </button>
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {loading && <div className="text-gray-300">Carregando tasks...</div>}
        {error && <div className="text-red-400">Erro: {error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-[#181c23] text-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2">Arquivo</th>
                  <th className="px-4 py-2">Título</th>
                  <th className="px-4 py-2">Categoria</th>
                  <th className="px-4 py-2">Prioridade</th>
                  <th className="px-4 py-2">Habilidade</th>
                  <th className="px-4 py-2">Descrição</th>
                  <th className="px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.file} className="hover:bg-[#282c34] transition">
                    <td className="px-4 py-2 font-mono text-xs text-blue-300">{task.file}</td>
                    <td className="px-4 py-2 font-semibold">{task.title}</td>
                    <td className="px-4 py-2">{task.category}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'alta' ? 'bg-red-700 text-white' : task.priority === 'média' ? 'bg-yellow-700 text-white' : 'bg-green-700 text-white'}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2">{task.habilidade}</td>
                    <td className="px-4 py-2 max-w-xs truncate" title={task.description}>
                      {task.description}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleEdit(task)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleDelete(task.file)}
                      >
                        Deletar
                      </button>
                      <button
                        className="bg-yellow-700 hover:bg-yellow-800 text-white px-2 py-1 rounded text-xs"
                        disabled={validating === task.file}
                        onClick={() => handleValidate(task.file)}
                      >
                        {validating === task.file ? 'Validando...' : 'Validar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
