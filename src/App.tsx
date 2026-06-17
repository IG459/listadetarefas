import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { LoginView } from './components/LoginView';
import type { Task, CategoryName, Priority, UserSession } from './types';
import { MOCK_TASKS } from './services/storage';
import { supabaseService } from './services/supabaseService';
import { supabase } from './services/supabaseClient';

function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'analytics' | 'calendar'>('tasks');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Carrega a sessão ativa do Supabase e escuta mudanças de estado reativamente
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      if (activeSession?.user) {
        setSession({
          id: activeSession.user.id,
          email: activeSession.user.email || '',
          username: activeSession.user.email || ''
        });
      } else {
        setSession(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      if (activeSession?.user) {
        setSession({
          id: activeSession.user.id,
          email: activeSession.user.email || '',
          username: activeSession.user.email || ''
        });
      } else {
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Carrega as tarefas quando a sessão do usuário é ativada/alterada (via Supabase)
  useEffect(() => {
    async function loadTasks() {
      if (!session) {
        setTasks([]);
        return;
      }
      setIsLoading(true);
      try {
        let userTasks = await supabaseService.getTasks(session.email);
        if (userTasks.length === 0) {
          // Salva as tarefas iniciais no Supabase se for a primeira vez
          const initial = MOCK_TASKS(session.email);
          userTasks = await supabaseService.saveInitialTasks(session.email, initial);
        }
        setTasks(userTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas do Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, [session]);

  // Handler para Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // CRUD: Adicionar Tarefa
  const handleAddTask = async (title: string, description: string, category: CategoryName, priority: Priority, dueDate: string) => {
    if (!session) return;
    
    const newTask: Task = {
      id: `${session.id}-${Date.now()}`,
      title,
      description: description.trim() || undefined,
      completed: false,
      category,
      priority,
      dueDate,
      createdAt: new Date().toISOString()
    };

    try {
      // Atualização otimista: adiciona no estado local
      setTasks(prevTasks => [newTask, ...prevTasks]);
      // Sincroniza no Supabase
      await supabaseService.addTask(newTask, session.email);
    } catch (error) {
      console.error('Erro ao adicionar tarefa no Supabase:', error);
      // Reverte o estado local em caso de erro
      setTasks(prevTasks => prevTasks.filter(t => t.id !== newTask.id));
    }
  };

  // CRUD: Marcar/Desmarcar como concluída
  const handleToggleComplete = async (id: string) => {
    if (!session) return;

    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    try {
      // Atualização otimista: altera no estado local
      setTasks(prevTasks => prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
      // Sincroniza no Supabase
      await supabaseService.toggleComplete(id, taskToToggle.completed);
    } catch (error) {
      console.error('Erro ao alternar estado da tarefa no Supabase:', error);
      // Reverte o estado local em caso de erro
      setTasks(prevTasks => prevTasks.map((task) =>
        task.id === id ? { ...task, completed: taskToToggle.completed } : task
      ));
    }
  };

  // CRUD: Excluir Tarefa
  const handleDeleteTask = async (id: string) => {
    if (!session) return;

    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    try {
      // Atualização otimista: remove do estado local
      setTasks(prevTasks => prevTasks.filter((task) => task.id !== id));
      // Sincroniza no Supabase
      await supabaseService.deleteTask(id);
    } catch (error) {
      console.error('Erro ao excluir tarefa no Supabase:', error);
      // Reverte o estado local em caso de erro
      setTasks(prevTasks => [...prevTasks, taskToDelete].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    }
  };

  // Se não houver sessão ativa, exibe a tela de login
  if (!session) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Navbar Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        username={session.username}
        onLogout={handleLogout}
      />

      {/* Conteúdo Principal Centralizado */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 text-sm font-medium animate-pulse">Carregando suas tarefas do Supabase...</p>
          </div>
        ) : (
          <>
            {/* Renderiza a aba correspondente baseada no estado */}
            {activeTab === 'tasks' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Coluna da Esquerda: Formulário de Adicionar */}
                <div className="lg:col-span-1">
                  <TaskForm onAddTask={handleAddTask} />
                </div>

                {/* Coluna da Direita: Lista de Tarefas com Filtros */}
                <div className="lg:col-span-2">
                  <TaskList
                    tasks={tasks}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                </div>

              </div>
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView tasks={tasks} />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            )}
          </>
        )}

      </main>

      {/* Rodapé Simples */}
      <footer className="py-6 border-t border-slate-100 text-center text-xs text-slate-400">
        TaskFlow © {new Date().getFullYear()} — Feito com React, Tailwind CSS v4 e Lucide Icons.
      </footer>
    </div>
  );
}

export default App;
