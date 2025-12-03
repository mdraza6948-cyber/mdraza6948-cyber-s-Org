import React from 'react';
import { JournalEntry } from '../types';
import { Card, Button } from './ui';

interface EntryListProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const EntryList: React.FC<EntryListProps> = ({ 
  entries, 
  isLoading, 
  onEdit, 
  onDelete, 
  onCreateNew 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Your Journal</h2>
           <p className="text-slate-500 text-sm mt-1">{entries.length} {entries.length === 1 ? 'entry' : 'entries'} recorded</p>
        </div>
        <Button onClick={onCreateNew}>+ New Entry</Button>
      </div>

      {entries.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-300 shadow-none bg-slate-50">
          <div className="mx-auto h-12 w-12 text-slate-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No entries yet</h3>
          <p className="text-slate-500 mb-6">Capture your first thought today.</p>
          <Button onClick={onCreateNew} variant="secondary">Start Writing</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-5 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block mb-1">
                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </span>
                   <h3 className="text-xl font-bold text-slate-800">{entry.title}</h3>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button 
                        onClick={() => onEdit(entry)} 
                        className="text-slate-400 hover:text-emerald-600 p-1"
                        title="Edit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => { if(window.confirm('Are you sure?')) onDelete(entry.id); }} 
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
              </div>
              
              <p className="text-slate-600 line-clamp-3 mb-4">{entry.content}</p>
              
              {entry.aiReflection && (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex items-start gap-2">
                   <span className="text-lg">✨</span>
                   <p className="text-sm text-emerald-800 italic">"{entry.aiReflection}"</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};