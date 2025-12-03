import { User, JournalEntry } from '../types';

// Keys for localStorage
const USERS_KEY = 'mindful_journal_users';
const ENTRIES_KEY = 'mindful_journal_entries';
const SESSION_KEY = 'mindful_journal_session';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// User Auth Services
export const signUp = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usersRaw = localStorage.getItem(USERS_KEY);
      const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
      
      if (users.find((u) => u.email === email)) {
        reject(new Error('User already exists'));
        return;
      }

      const newUser = { id: generateId(), name, email, password }; // Note: In real app, hash password!
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const publicUser: User = { id: newUser.id, name: newUser.name, email: newUser.email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      resolve(publicUser);
    }, 800);
  });
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usersRaw = localStorage.getItem(USERS_KEY);
      const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
      
      const user = users.find((u) => u.email === email && u.password === password);
      
      if (!user) {
        reject(new Error('Invalid credentials'));
        return;
      }

      const publicUser: User = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      resolve(publicUser);
    }, 800);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(SESSION_KEY);
    resolve();
  });
};

export const getSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

// Journal Services
export const getEntries = (userId: string): Promise<JournalEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entriesRaw = localStorage.getItem(ENTRIES_KEY);
      const entries: JournalEntry[] = entriesRaw ? JSON.parse(entriesRaw) : [];
      // Filter by user and sort by date descending
      const userEntries = entries
        .filter(e => e.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(userEntries);
    }, 400);
  });
};

export const saveEntry = (entry: Omit<JournalEntry, 'id' | 'updatedAt'> & { id?: string }): Promise<JournalEntry> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entriesRaw = localStorage.getItem(ENTRIES_KEY);
      const entries: JournalEntry[] = entriesRaw ? JSON.parse(entriesRaw) : [];
      
      const now = new Date().toISOString();
      let savedEntry: JournalEntry;

      if (entry.id) {
        // Update existing
        const index = entries.findIndex(e => e.id === entry.id);
        if (index !== -1) {
          savedEntry = { ...entries[index], ...entry, updatedAt: now } as JournalEntry;
          entries[index] = savedEntry;
        } else {
          // Fallback if not found, treat as new
          savedEntry = { ...entry, id: generateId(), updatedAt: now } as JournalEntry;
          entries.push(savedEntry);
        }
      } else {
        // Create new
        savedEntry = { ...entry, id: generateId(), updatedAt: now } as JournalEntry;
        entries.push(savedEntry);
      }

      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
      resolve(savedEntry);
    }, 600);
  });
};

export const deleteEntry = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entriesRaw = localStorage.getItem(ENTRIES_KEY);
      const entries: JournalEntry[] = entriesRaw ? JSON.parse(entriesRaw) : [];
      const newEntries = entries.filter(e => e.id !== id);
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
      resolve();
    }, 400);
  });
};