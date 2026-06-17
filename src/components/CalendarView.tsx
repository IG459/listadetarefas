import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import type { Task } from '../types';
import { CATEGORIES } from '../types';
import { TaskItem } from './TaskItem';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onDelete
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Define o dia selecionado inicialmente como hoje (formato YYYY-MM-DD local)
  const getLocalDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  const [selectedDateStr, setSelectedDateStr] = useState(getLocalDateString(new Date()));

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Nomes dos meses em português
  const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Navegação de mês
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Lógica de cálculo dos dias no grid do calendário
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Domingo, 1 = Segunda, etc.
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

  const gridCells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // 1. Dias do mês anterior para preenchimento
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthDate = new Date(currentYear, currentMonth - 1, day);
    gridCells.push({
      dateStr: getLocalDateString(prevMonthDate),
      dayNum: day,
      isCurrentMonth: false
    });
  }

  // 2. Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const curMonthDate = new Date(currentYear, currentMonth, day);
    gridCells.push({
      dateStr: getLocalDateString(curMonthDate),
      dayNum: day,
      isCurrentMonth: true
    });
  }

  // 3. Dias do mês seguinte para completar o grid (geralmente múltiplo de 7, totalizando 35 ou 42 células)
  const totalCells = gridCells.length;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthDate = new Date(currentYear, currentMonth + 1, day);
    gridCells.push({
      dateStr: getLocalDateString(nextMonthDate),
      dayNum: day,
      isCurrentMonth: false
    });
  }

  // Retorna as tarefas para uma data específica
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  const selectedTasks = getTasksForDate(selectedDateStr);

  // Formatação amigável da data selecionada
  const formatSelectedDateLabel = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Bloco 1 & 2: Calendário (Grid) */}
      <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm flex flex-col">
        
        {/* Cabeçalho do Calendário */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAYS.map((day) => (
            <span key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1.5">
              {day}
            </span>
          ))}
        </div>

        {/* Grid de Dias */}
        <div className="grid grid-cols-7 gap-1.5 flex-1">
          {gridCells.map((cell, idx) => {
            const dayTasks = getTasksForDate(cell.dateStr);
            const isSelected = selectedDateStr === cell.dateStr;
            const isToday = getLocalDateString(new Date()) === cell.dateStr;

            // Limita a exibição de dots das categorias em cada dia
            const maxDots = 3;
            const uniqueCategories = Array.from(new Set(dayTasks.map((t) => t.category)));

            return (
              <button
                key={`${cell.dateStr}-${idx}`}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-[56px] p-1.5 rounded-xl border flex flex-col justify-between items-start transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                  cell.isCurrentMonth
                    ? isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                      : isToday
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800'
                    : 'bg-slate-50/50 border-transparent text-slate-400'
                }`}
              >
                {/* Dia Numérico */}
                <span className={`text-xs font-bold ${
                  isSelected ? 'text-white' : cell.isCurrentMonth ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {cell.dayNum}
                </span>

                {/* Dots Indicadores de Categoria */}
                {dayTasks.length > 0 && (
                  <div className="flex gap-1 mt-2.5 flex-wrap">
                    {uniqueCategories.slice(0, maxDots).map((catName) => {
                      const style = CATEGORIES[catName];
                      return (
                        <span
                          key={catName}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : style.dot
                          }`}
                          title={`${dayTasks.filter(t => t.category === catName).length} tarefas de ${catName}`}
                        />
                      );
                    })}
                    {uniqueCategories.length > maxDots && (
                      <span className={`text-[8px] font-bold leading-none ${
                        isSelected ? 'text-white' : 'text-slate-400'
                      }`}>
                        +
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bloco 3: Lista de tarefas para o dia selecionado */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm flex flex-col">
        <h4 className="font-bold text-slate-800 text-sm sm:text-base border-b border-slate-50 pb-3 mb-4">
          Tarefas do Dia
        </h4>

        {/* Data selecionada rotulada */}
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-500" />
          {formatSelectedDateLabel(selectedDateStr)}
        </div>

        {/* Lista de itens correspondente */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
          {selectedTasks.length > 0 ? (
            selectedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <CalendarIcon className="w-8 h-8 text-slate-400 mb-2" />
              <p className="font-bold text-xs text-slate-600">Nenhum compromisso</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[160px]">
                Nenhuma tarefa agendada para esta data.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
