import React, { useState } from 'react';
import { Search, ListTodo, Inbox } from 'lucide-react';
import { TaskItem } from './TaskItem';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDelete
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filtra as tarefas baseado no status e na busca
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);
    
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // 2. Ordena as tarefas: pendentes primeiro, depois por data de vencimento (mais antiga/urgente primeiro)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // não concluídas primeiro
    }
    // Caso contrário, ordena por data de vencimento
    return a.dueDate.localeCompare(b.dueDate);
  });

  // Contador de tarefas para os badges dos filtros
  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm">
        
        {/* Barra de Busca */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Botões de Filtros */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
            }`}
          >
            Todas
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === 'all' ? 'bg-indigo-200/50 text-indigo-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === 'pending'
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
            }`}
          >
            Pendentes
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === 'pending' ? 'bg-amber-200/50 text-amber-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === 'completed'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
            }`}
          >
            Concluídas
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === 'completed' ? 'bg-emerald-200/50 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {completedCount}
            </span>
          </button>
        </div>

      </div>

      {/* List content */}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
            />
          ))
        ) : (
          /* Estado Vazio */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-100/80 shadow-sm text-center">
            {searchQuery ? (
              <>
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Nenhuma tarefa encontrada</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs">
                  Não encontramos tarefas que correspondam a "{searchQuery}". Tente usar outros termos de busca.
                </p>
              </>
            ) : filter === 'completed' ? (
              <>
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                  <ListTodo className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Nenhuma concluída ainda</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs">
                  Marque o círculo ao lado das suas tarefas ativas para concluí-las.
                </p>
              </>
            ) : filter === 'pending' ? (
              <>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Tudo em ordem!</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs">
                  Você não possui nenhuma tarefa pendente. Excelente trabalho!
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
                  <ListTodo className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1 font-outfit">Sua lista está vazia</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs">
                  Comece adicionando uma nova tarefa usando o formulário acima.
                </p>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
