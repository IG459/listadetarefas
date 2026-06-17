export type Priority = 'Alta' | 'Média' | 'Baixa';

export type CategoryName = 'Trabalho' | 'Pessoal' | 'Estudos' | 'Outros';

export interface CategoryInfo {
  name: CategoryName;
  color: string;      // Classe de texto
  bg: string;         // Classe de fundo
  border: string;     // Classe de borda
  dot: string;        // Classe da bolinha indicadora
}

export interface Task {
  id: string;
  title: string;
  description?: string; // Descrição opcional da tarefa
  completed: boolean;
  category: CategoryName;
  priority: Priority;
  dueDate: string; // ISO string YYYY-MM-DD
  createdAt: string; // ISO string
}

export interface UserSession {
  username: string;
  email: string;
  id: string;
}

export const CATEGORIES: Record<CategoryName, CategoryInfo> = {
  Trabalho: {
    name: 'Trabalho',
    color: 'text-indigo-700 font-medium',
    bg: 'bg-indigo-50/70',
    border: 'border border-indigo-100/80',
    dot: 'bg-indigo-500'
  },
  Pessoal: {
    name: 'Pessoal',
    color: 'text-sky-700 font-medium',
    bg: 'bg-sky-50/70',
    border: 'border border-sky-100/80',
    dot: 'bg-sky-500'
  },
  Estudos: {
    name: 'Estudos',
    color: 'text-emerald-700 font-medium',
    bg: 'bg-emerald-50/70',
    border: 'border border-emerald-100/80',
    dot: 'bg-emerald-500'
  },
  Outros: {
    name: 'Outros',
    color: 'text-amber-700 font-medium',
    bg: 'bg-amber-50/70',
    border: 'border border-amber-100/80',
    dot: 'bg-amber-500'
  }
};

export const PRIORITY_STYLES: Record<Priority, { color: string; bg: string; border: string; label: string }> = {
  Alta: {
    label: 'Alta',
    color: 'text-rose-700 font-semibold',
    bg: 'bg-rose-50',
    border: 'border border-rose-100'
  },
  Média: {
    label: 'Média',
    color: 'text-amber-700 font-semibold',
    bg: 'bg-amber-50',
    border: 'border border-amber-100'
  },
  Baixa: {
    label: 'Baixa',
    color: 'text-emerald-700 font-medium',
    bg: 'bg-emerald-50/70',
    border: 'border border-emerald-100/80'
  }
};

