import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/ui';
import { Auth } from './components/Auth';
import { EntryList } from './components/EntryList';
import { Editor } from './components/Editor';
import { getSession, logout, getEntries, saveEntry, deleteEntry } from './services/storage';
import { User, JournalEntry, ViewState } from './types';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [viewState, setViewState] = useState<ViewState>('LIST');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    const data = await getEntries(user.id);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleCreateNew = () => {
    setSelectedEntry(undefined);
    setViewState('CREATE');
  };

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setViewState('EDIT');
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    await fetchEntries();
  };

  const handleSave = async (entryData: Omit<JournalEntry, 'id' | 'userId' | 'updatedAt'> & { id?: string }) => {
    await saveEntry({ ...entryData, userId: user.id });
    await fetchEntries();
    setViewState('LIST');
  };

  return (
    <>
      {viewState === 'LIST' && (
        <EntryList 
          entries={entries} 
          isLoading={loading} 
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {(viewState === 'CREATE' || viewState === 'EDIT') && (
        <Editor 
          initialEntry={selectedEntry} 
          onSave={handleSave} 
          onCancel={() => setViewState('LIST')} 
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setInitializing(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Auth onAuthSuccess={handleLogin} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;