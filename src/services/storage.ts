import type { Task, UserSession } from '../types';

const TASKS_KEY_PREFIX = 'todo_app_tasks_';
const SESSION_KEY = 'todo_app_session';

// Tarefas iniciais para novos usuários (Visceral/Wow Factor de demonstração)
export const MOCK_TASKS = (username: string): Task[] => {
  const today = new Date();
  
  const formatDate = (daysOffset: number) => {
    const d = new Date();
    d.setDate(today.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: `${username}-1`,
      title: 'Finalizar relatório financeiro trimestral',
      description: 'Preparar o demonstrativo de fluxo de caixa e o balanço consolidado para a reunião.',
      completed: false,
      category: 'Trabalho',
      priority: 'Alta',
      dueDate: formatDate(1),
      createdAt: new Date().toISOString()
    },
    {
      id: `${username}-2`,
      title: 'Comprar frutas e vegetais frescos na feira',
      description: 'Priorizar alimentos orgânicos, focar em folhas verdes e frutas da estação.',
      completed: true,
      category: 'Pessoal',
      priority: 'Baixa',
      dueDate: formatDate(0),
      createdAt: new Date().toISOString()
    },
    {
      id: `${username}-3`,
      title: 'Estudar conceitos de React Server Components',
      description: 'Entender a fundo o funcionamento de renderização no servidor vs. renderização no cliente.',
      completed: false,
      category: 'Estudos',
      priority: 'Média',
      dueDate: formatDate(3),
      createdAt: new Date().toISOString()
    },
    {
      id: `${username}-4`,
      title: 'Planejar roteiro de viagem do final de semana',
      description: 'Verificar hotéis, rotas e pontos turísticos interessantes para visitar.',
      completed: false,
      category: 'Pessoal',
      priority: 'Média',
      dueDate: formatDate(5),
      createdAt: new Date().toISOString()
    },
    {
      id: `${username}-5`,
      title: 'Revisar PR da equipe de desenvolvimento',
      completed: true,
      category: 'Trabalho',
      priority: 'Alta',
      dueDate: formatDate(-1),
      createdAt: new Date().toISOString()
    }
  ];
};

export const storageService = {
  // Retorna as tarefas associadas a um usuário específico
  getTasks(username: string): Task[] {
    const key = `${TASKS_KEY_PREFIX}${username.toLowerCase().trim()}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = MOCK_TASKS(username);
      this.saveTasks(username, initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  // Salva a lista de tarefas associada ao usuário
  saveTasks(username: string, tasks: Task[]): void {
    const key = `${TASKS_KEY_PREFIX}${username.toLowerCase().trim()}`;
    localStorage.setItem(key, JSON.stringify(tasks));
  },

  // Retorna a sessão ativa
  getCurrentSession(): UserSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Salva a sessão ativa
  saveSession(session: UserSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  // Remove a sessão ativa
  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
};
