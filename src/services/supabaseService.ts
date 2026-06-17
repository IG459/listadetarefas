import { supabase } from './supabaseClient';
import type { Task } from '../types';

export const supabaseService = {
  // Busca tarefas do usuário no Supabase
  async getTasks(username: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    }
    return data as Task[];
  },

  // Insere uma nova tarefa no banco de dados
  async addTask(task: Task, username: string): Promise<Task> {
    const taskWithUser = {
      ...task,
      username: username.toLowerCase().trim()
    };
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskWithUser])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
    
    // Remove o campo username do retorno para corresponder ao tipo Task do frontend
    const { username: _, ...rest } = data;
    return rest as Task;
  },

  // Alterna o estado completed de uma tarefa
  async toggleComplete(id: string, currentCompleted: boolean): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !currentCompleted })
      .eq('id', id);

    if (error) {
      console.error('Erro ao alternar estado da tarefa:', error);
      throw error;
    }
  },

  // Exclui uma tarefa pelo ID
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  },

  // Insere tarefas mocks em lote se for o primeiro acesso do usuário
  async saveInitialTasks(username: string, tasks: Task[]): Promise<Task[]> {
    const tasksWithUser = tasks.map(task => ({
      ...task,
      username: username.toLowerCase().trim()
    }));
    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksWithUser)
      .select();

    if (error) {
      console.error('Erro ao salvar tarefas iniciais:', error);
      throw error;
    }

    return (data || []).map(({ username: _, ...rest }) => rest as Task);
  }
};
