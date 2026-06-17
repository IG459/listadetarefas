import React from 'react';
import { BarChart3, CheckCircle2, Clock, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import type { Task, CategoryName, Priority } from '../types';
import { CATEGORIES } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Cálculo de Tarefas Atrasadas (não concluídas e vencimento menor que hoje)
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter((t) => !t.completed && t.dueDate < todayStr).length;

  // 1. Agrupamento por Categoria
  const categories: CategoryName[] = ['Trabalho', 'Pessoal', 'Estudos', 'Outros'];
  const categoryData = categories.map((catName) => {
    const count = tasks.filter((t) => t.category === catName).length;
    const completedCount = tasks.filter((t) => t.category === catName && t.completed).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      name: catName,
      count,
      completedCount,
      pct,
      info: CATEGORIES[catName]
    };
  });

  // 2. Agrupamento por Prioridade (Alta, Média, Baixa)
  const priorities: Priority[] = ['Alta', 'Média', 'Baixa'];
  const priorityData = priorities.map((prio) => {
    const totalPrio = tasks.filter((t) => t.priority === prio).length;
    const completedPrio = tasks.filter((t) => t.priority === prio && t.completed).length;
    const pendingPrio = totalPrio - completedPrio;
    return {
      name: prio,
      total: totalPrio,
      completed: completedPrio,
      pending: pendingPrio
    };
  });

  // 3. Histórico de Conclusão nos Últimos 7 Dias (Gráfico de Linha SVG)
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const last7Days = getLast7Days();
  const historyData = last7Days.map((dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const completedCount = tasks.filter((t) => t.completed && t.dueDate === dateStr).length;
    
    // Nome do dia formatado
    const d = new Date(year, month - 1, day);
    const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    return {
      dateStr,
      dayName: capitalizedDay,
      count: completedCount
    };
  });

  // Geração de Insights de Produtividade
  const getProductivityInsights = () => {
    const insights = [];
    
    if (overdueCount > 0) {
      insights.push({
        type: 'warning',
        text: `Você possui ${overdueCount} tarefa(s) atrasada(s). Tente reavaliar as datas ou priorizar a conclusão para hoje.`
      });
    }

    const highPriorityPending = tasks.filter((t) => !t.completed && t.priority === 'Alta').length;
    if (highPriorityPending > 0) {
      insights.push({
        type: 'info',
        text: `Atenção: existem ${highPriorityPending} tarefa(s) de prioridade ALTA pendente(s). Sugerimos focar nelas para evitar atrasos.`
      });
    }

    if (completionRate >= 80 && total > 3) {
      insights.push({
        type: 'success',
        text: 'Excelente ritmo! Você completou mais de 80% das tarefas do seu painel. Continue assim!'
      });
    } else if (completionRate > 0 && completionRate < 50) {
      insights.push({
        type: 'tip',
        text: 'Dica: Tente quebrar tarefas grandes em pequenas etapas secundárias para aumentar sua taxa de conclusão diária.'
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        text: 'Tudo pronto! Crie novas tarefas com prioridades e prazos para receber análises detalhadas de rotina.'
      });
    }

    return insights;
  };

  const insights = getProductivityInsights();

  // Constantes de cálculo para o Donut Chart de categorias
  let accumulatedAngle = 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Constantes para o Gráfico de Linha SVG
  const maxHistoryCount = Math.max(...historyData.map((d) => d.count), 1);
  const linePoints = historyData.map((d, i) => {
    const x = 40 + i * 53.3; // Distribuídos igualmente de 40 a 360 no SVG
    const y = 120 - (d.count / maxHistoryCount) * 90; // Escala entre 30 e 120 no SVG
    return { x, y, ...d };
  });

  // Cria a string de pontos para o polyling
  const polylinePointsString = linePoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-6">
      
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Criadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Criadas</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">{total}</span>
          </div>
        </div>

        {/* Card 2: Concluídas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Concluídas</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 text-emerald-700">{completed}</span>
          </div>
        </div>

        {/* Card 3: Pendentes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Pendentes</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">{pending}</span>
          </div>
        </div>

        {/* Card 4: Atrasadas */}
        <div className={`bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors ${
          overdueCount > 0 ? 'border-rose-100 bg-rose-50/20' : 'border-slate-100/80'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            overdueCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 border border-slate-100 text-slate-400'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Atrasadas</span>
            <span className={`text-xl sm:text-2xl font-bold ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {overdueCount}
            </span>
          </div>
        </div>

        {/* Card 5: Taxa de Conclusão */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Taxa</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">{completionRate}%</span>
          </div>
        </div>
      </div>

      {total > 0 ? (
        <>
          {/* Gráficos em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Gráfico 1: Histórico de Produtividade Diária (Linha) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm flex flex-col justify-between md:col-span-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">Produtividade Semanal</h4>
                <p className="text-slate-400 text-xs mb-4">Quantidade de tarefas concluídas nos últimos 7 dias</p>
              </div>
              
              {/* Gráfico de Linha SVG */}
              <div className="w-full">
                <svg className="w-full h-40" viewBox="0 0 400 150">
                  {/* Grid Lines */}
                  <line x1="30" y1="30" x2="370" y2="30" stroke="#f8fafc" strokeWidth="1" />
                  <line x1="30" y1="75" x2="370" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="120" x2="370" y2="120" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Curva de dados */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePointsString}
                    className="transition-all duration-500"
                  />

                  {/* Pontos de dados interativos com rótulo */}
                  {linePoints.map((point) => (
                    <g key={point.dateStr} className="group/point cursor-pointer">
                      {/* Círculo luminoso de fundo no hover */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="8"
                        fill="#a7f3d0"
                        className="opacity-0 group-hover/point:opacity-75 transition-opacity"
                      />
                      {/* Ponto central */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="4.5"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Texto de Valor no Ponto (Sempre visível se > 0) */}
                      {point.count > 0 && (
                        <text
                          x={point.x}
                          y={point.y - 10}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-slate-800 bg-white"
                        >
                          {point.count}
                        </text>
                      )}
                      {/* Rótulo do dia */}
                      <text
                        x={point.x}
                        y="140"
                        textAnchor="middle"
                        className="text-[10px] font-semibold fill-slate-400 group-hover/point:fill-slate-700 transition-colors"
                      >
                        {point.dayName}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Gráfico 2: Distribuição por Categoria (Rosca) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">Categorias</h4>
                <p className="text-slate-400 text-xs mb-4">Distribuição do total de tarefas criadas</p>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-6">
                {/* Rosca SVG */}
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="#f8fafc"
                      strokeWidth="12"
                    />
                    {categoryData.map((cat) => {
                      if (cat.count === 0) return null;
                      const strokeDashoffset = circumference - (circumference * cat.pct) / 100;
                      const strokeDasharray = `${circumference} ${circumference}`;
                      
                      let hexColor = '#059669'; // Trabalho (emerald)
                      if (cat.name === 'Pessoal') hexColor = '#38bdf8'; // sky
                      else if (cat.name === 'Estudos') hexColor = '#34d399'; // emerald/mint
                      else if (cat.name === 'Outros') hexColor = '#fbbf24'; // amber

                      const rotation = accumulatedAngle;
                      accumulatedAngle += (cat.pct / 100) * 360;

                      return (
                        <circle
                          key={cat.name}
                          cx="60"
                          cy="60"
                          r={radius}
                          fill="transparent"
                          stroke={hexColor}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          transform={`rotate(${rotation} 60 60)`}
                          className="transition-all duration-500 ease-out"
                          style={{ transformOrigin: 'center' }}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-extrabold text-slate-800 leading-none">{total}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                  </div>
                </div>

                {/* Legendas e contagens */}
                <div className="w-full space-y-2">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs pb-1 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${cat.info.dot}`} />
                        <span className="font-semibold text-slate-600">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{cat.count}</span>
                        <span className="text-slate-400">({cat.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Segunda linha de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Gráfico 3: Prioridades (Barras Lado a Lado) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm flex flex-col justify-between md:col-span-1">
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">Status por Prioridade</h4>
                <p className="text-slate-400 text-xs mb-4">Relação de concluídas e pendentes</p>
              </div>

              <div className="py-2">
                <div className="flex items-end justify-around h-32 border-b border-slate-100 px-1">
                  {priorityData.map((prio) => {
                    const maxCount = Math.max(...priorityData.map(d => d.total), 1);
                    const completedHeight = (prio.completed / maxCount) * 100;
                    const pendingHeight = (prio.pending / maxCount) * 100;

                    return (
                      <div key={prio.name} className="flex flex-col items-center gap-1.5 w-1/4">
                        <div className="flex items-end gap-1 w-full justify-center h-24">
                          {/* Pendentes (Amber) */}
                          <div 
                            className="w-3.5 bg-amber-400 rounded-t-sm transition-all duration-500 ease-out relative group/bar"
                            style={{ height: `${pendingHeight}%` }}
                          >
                            {prio.pending > 0 && (
                              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[8px] px-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-bold">
                                {prio.pending}
                              </span>
                            )}
                          </div>
                          {/* Concluídas (Emerald) */}
                          <div 
                            className="w-3.5 bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out relative group/bar2"
                            style={{ height: `${completedHeight}%` }}
                          >
                            {prio.completed > 0 && (
                              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[8px] px-1 rounded opacity-0 group-hover/bar2:opacity-100 transition-opacity font-bold">
                                {prio.completed}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{prio.name}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-4 mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm" />
                    <span>Pendentes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                    <span>Concluídas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 4: Insights e Recomendações Automáticas (Wow Factor) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm flex flex-col justify-between md:col-span-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Insights & Recomendações
                </h4>
                <p className="text-slate-400 text-xs mb-4">Análise automática da sua lista e rotina de produtividade</p>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] pr-1">
                {insights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-medium ${
                      insight.type === 'warning' 
                        ? 'bg-rose-50/50 border-rose-100 text-rose-800' 
                        : insight.type === 'success' 
                        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
                        : insight.type === 'info' 
                        ? 'bg-sky-50/50 border-sky-100 text-sky-800' 
                        : 'bg-slate-50/80 border-slate-200/60 text-slate-750'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                      {insight.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {insight.type === 'info' && <Lightbulb className="w-4 h-4 text-sky-600" />}
                      {insight.type === 'tip' && <Lightbulb className="w-4 h-4 text-slate-600" />}
                    </div>
                    <p className="leading-relaxed">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      ) : (
        /* Estado Vazio de Estatísticas */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100/80 shadow-sm text-center px-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">Ainda sem métricas disponíveis</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xs">
            Crie e gerencie tarefas na aba "Tarefas" para carregar dados analíticos em tempo real.
          </p>
        </div>
      )}

    </div>
  );
};
