import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import type { CategoryName, Priority } from '../types';
import { CATEGORIES, PRIORITY_STYLES } from '../types';

interface TaskFormProps {
  onAddTask: (title: string, description: string, category: CategoryName, priority: Priority, dueDate: string) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryName>('Trabalho');
  const [priority, setPriority] = useState<Priority>('Média');
  
  // Define a data padrão de vencimento como hoje
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };
  const [dueDate, setDueDate] = useState(getTodayDateString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask(title.trim(), description.trim(), category, priority, dueDate);
    
    // Reseta o formulário
    setTitle('');
    setDescription('');
    setCategory('Trabalho');
    setPriority('Média');
    setDueDate(getTodayDateString());
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <h3 className="font-bold text-slate-800 text-base leading-none">Criar Nova Tarefa</h3>

      <div className="space-y-4">
        {/* Título da Tarefa */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-sm font-medium"
            required
          />
        </div>

        {/* Descrição da Tarefa */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)..."
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-xs sm:text-sm font-medium resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORIES) as CategoryName[]).map((catName) => {
                const cat = CATEGORIES[catName];
                const isSelected = category === catName;
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setCategory(catName)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? `${cat.bg} ${cat.border} ${cat.color} ring-2 ring-emerald-500/10`
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                    {catName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Prioridade
            </label>
            <div className="flex gap-2">
              {(Object.keys(PRIORITY_STYLES) as Priority[]).map((prioName) => {
                const isSelected = priority === prioName;
                const style = PRIORITY_STYLES[prioName];
                
                // Mapear bordas de seleção ativa
                let activeRing = '';
                if (prioName === 'Alta') activeRing = 'ring-rose-500/20 border-rose-300';
                else if (prioName === 'Média') activeRing = 'ring-amber-500/20 border-amber-300';
                else activeRing = 'ring-emerald-500/20 border-emerald-300';

                return (
                  <button
                    key={prioName}
                    type="button"
                    onClick={() => setPriority(prioName)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 text-center ${
                      isSelected
                        ? `${style.bg} ${style.border} ${style.color} ring-2 ${activeRing}`
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    {prioName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data de Vencimento */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Data para Conclusão
          </label>
          <div className="relative inline-flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer relative"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-200 transition-all transform hover:-translate-y-0.5 duration-150 text-sm"
      >
        <Plus className="w-4 h-4" />
        Adicionar Tarefa
      </button>
    </form>
  );
};
