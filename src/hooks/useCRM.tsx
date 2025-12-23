import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CRMClient {
  id: string;
  owner_id: string;
  lead_id: string | null;
  name: string;
  phone: string;
  email: string;
  stage: 'prospect' | 'hot' | 'warm' | 'cold' | 'closed';
  tags: string[];
  created_at: string;
  updated_at: string;
  leads?: any;
}

export interface CRMTask {
  id: string;
  client_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

export const useCRM = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('crm_clients')
        .select('*, leads(*)')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching CRM clients:', error);
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchClients();

    // Realtime subscription
    const channel = supabase
      .channel('crm-clients-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'crm_clients',
        filter: `owner_id=eq.${user?.id}`
      }, () => {
        fetchClients();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchClients]);

  const createClient = async (clientData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('crm_clients')
        .insert({ ...clientData, owner_id: user.id })
        .select()
        .single();

      if (error) throw error;
      toast.success('Client created successfully!');
      fetchClients();
      return data;
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
      throw error;
    }
  };

  const updateClientStage = async (clientId: string, stage: CRMClient['stage']) => {
    try {
      const { error } = await (supabase
        .from('crm_clients') as any)
        .update({ stage })
        .eq('id', clientId);

      if (error) throw error;
      toast.success('Client stage updated');
      fetchClients();
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client stage');
    }
  };

  const updateClient = async (clientId: string, updates: any) => {
    try {
      const { error } = await (supabase
        .from('crm_clients') as any)
        .update(updates)
        .eq('id', clientId);

      if (error) throw error;
      toast.success('Client updated');
      fetchClients();
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('crm_clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      toast.success('Client deleted');
      fetchClients();
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  return {
    clients,
    loading,
    createClient,
    updateClientStage,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};

export const useCRMTasks = (clientId?: string) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('crm_tasks')
        .select('*')
        .eq('owner_id', user.id)
        .order('due_date', { ascending: true });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user, clientId]);

  useEffect(() => {
    fetchTasks();

    // Realtime subscription for tasks
    const channel = supabase
      .channel('crm-tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'crm_tasks',
        filter: `owner_id=eq.${user?.id}`
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, clientId, fetchTasks]);

  const createTask = async (taskData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('crm_tasks')
        .insert([{ ...taskData, owner_id: user.id }] as any)
        .select()
        .single();

      if (error) throw error;
      toast.success('Task created');
      fetchTasks();
      return data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: any) => {
    try {
      const { error } = await (supabase
        .from('crm_tasks') as any)
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;
      toast.success('Task updated');
      fetchTasks();
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('crm_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      toast.success('Task deleted');
      fetchTasks();
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
