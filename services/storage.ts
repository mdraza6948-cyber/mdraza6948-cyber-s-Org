import { supabase } from './supabase';
import { User, JournalEntry } from '../types';

// Helper to map Supabase user to App User
const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email || '',
  name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
});

// Helper to map DB entry to JournalEntry
const mapEntry = (e: any): JournalEntry => ({
  id: e.id,
  userId: e.user_id,
  title: e.title,
  content: e.content,
  date: e.date,
  tags: e.tags || [],
  aiReflection: e.ai_reflection,
  updatedAt: e.updated_at,
});

// User Auth Services
export const signUp = async (name: string, email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error('Signup failed: No user returned');
  
  return mapUser(data.user);
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  if (!data.user) throw new Error('Login failed: No user returned');

  return mapUser(data.user);
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Journal Services
export const getEntries = async (userId: string): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching entries:', error);
    // Return empty array on error to prevent app crash, or throw
    return [];
  }

  return (data || []).map(mapEntry);
};

export const saveEntry = async (entry: Omit<JournalEntry, 'id' | 'updatedAt'> & { id?: string }): Promise<JournalEntry> => {
  const now = new Date().toISOString();
  
  const payload: any = {
    user_id: entry.userId,
    title: entry.title,
    content: entry.content,
    date: entry.date,
    tags: entry.tags,
    ai_reflection: entry.aiReflection,
    updated_at: now
  };

  let query;
  if (entry.id) {
    payload.id = entry.id;
    query = supabase.from('entries').update(payload).eq('id', entry.id);
  } else {
    // For new entries, let Supabase generate ID or use insert
    query = supabase.from('entries').insert(payload);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error('Error saving entry:', error);
    throw new Error(error.message);
  }

  return mapEntry(data);
};

export const deleteEntry = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};