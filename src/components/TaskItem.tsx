import React from 'react';
import { Trash2, Calendar, Check, AlertCircle } from 'lucide-react';
import type { Task } from '../types';
import { CATEGORIES, PRIORITY_STYLES } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete
}) => {
  const cat = CATEGORIES[task.category];
  const prio = PRIORITY_STYLES[task.priority];

  // Helper para formatar a data de vencimento e calcular a urgência
  const getDueDateInfo = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let label = '';
    let styleClass = 'text-slate-400 bg-slate-50 border-slate-100'; // Futuro/Neutro
    let isOverdue = false;

    if (diffDays === 0) {
      label = 'Hoje';
      styleClass = 'text-amber-700 bg-amber-50/70 border-amber-100/80 font-medium';
    } else if (diffDays === 1) {
      label = 'Amanhã';
      styleClass = 'text-emerald-700 bg-emerald-50/70 border-emerald-100/80 font-medium';
    } else if (diffDays === -1) {
      label = 'Ontem';
      styleClass = 'text-rose-700 bg-rose-50/70 border-rose-100/80 font-semibold';
      isOverdue = true;
    } else if (diffDays < 0) {
      label = `${Math.abs(diffDays)} dias atrás`;
      styleClass = 'text-rose-700 bg-rose-50/70 border-rose-100/80 font-semibold';
      isOverdue = true;
    } else {
      // Formato DD/MM
      label = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
    }

    return { label, styleClass, isOverdue };
  };

  const dateInfo = getDueDateInfo(task.dueDate);

  return (
    <div
      className={`group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100/80 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 ${
        task.completed ? 'opacity-55' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0 mr-3">
        {/* Custom Circular Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-emerald-500 bg-slate-55'
            }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3] animate-check" />}
        </button>

        {/* Content Group */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p
            className={`text-emerald-950 font-bold text-sm sm:text-base leading-snug break-words transition-all ${
              task.completed ? 'line-through text-slate-400 font-normal font-medium' : ''
            }`}
          >
            {task.title}
          </p>

          {task.description && (
            <p
              className={`text-xs text-slate-500 break-words font-medium transition-all ${
                task.completed ? 'line-through text-slate-400/80 font-normal' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Tags & Dates Grid */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Tag */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${cat.bg} ${cat.border} ${cat.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
              {task.category}
            </span>

            {/* Priority Tag */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${prio.bg} ${prio.border} ${prio.color}`}
            >
              {prio.label}
            </span>

            {/* Due Date Indicator */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border ${
                task.completed ? 'text-slate-400 bg-slate-50 border-slate-100' : dateInfo.styleClass
              }`}
            >
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {dateInfo.label}
              {!task.completed && dateInfo.isOverdue && (
                <AlertCircle className="w-3 h-3 text-rose-600 flex-shrink-0" />
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Action Button */}
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100 border border-transparent hover:border-rose-100"
        title="Excluir tarefa"
      >
        <Trash2 className="w-4 h-4 sm:w-5 h-5" />
      </button>
    </div>
  );
};
