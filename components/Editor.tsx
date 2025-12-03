import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { generateReflection } from '../services/gemini';
import { Button, Card } from './ui';

interface EditorProps {
  initialEntry?: JournalEntry;
  onSave: (entry: Omit<JournalEntry, 'id' | 'userId' | 'updatedAt'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

export const Editor: React.FC<EditorProps> = ({ initialEntry, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reflection, setReflection] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setContent(initialEntry.content);
      setDate(initialEntry.date.split('T')[0]);
      setReflection(initialEntry.aiReflection || null);
    }
  }, [initialEntry]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please provide both a title and content.");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        id: initialEntry?.id,
        title,
        content,
        date: new Date(date).toISOString(),
        aiReflection: reflection || undefined,
        tags: []
      });
    } catch (err) {
      setError("Failed to save entry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateReflection = async () => {
    if (!content.trim()) {
        setError("Write something first to get a reflection.");
        return;
    }
    setIsReflecting(true);
    setError(null);
    try {
      const result = await generateReflection(content);
      setReflection(result);
    } catch (err) {
      setError("Could not generate reflection at this time.");
    } finally {
      setIsReflecting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{initialEntry ? 'Edit Entry' : 'New Entry'}</h2>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>

      <Card className="p-6">
        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
            </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="How are you feeling today?"
              className="w-full px-3 py-2 text-lg font-medium border-b-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors placeholder:font-normal"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Entry</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-slate-50 leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 pt-6">
          <Button 
            variant="secondary" 
            onClick={handleGenerateReflection}
            isLoading={isReflecting}
            type="button"
            className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
          >
             ✨ AI Reflection
          </Button>

          <div className="flex space-x-3">
             <Button variant="ghost" onClick={onCancel} type="button">Discard</Button>
             <Button onClick={handleSave} isLoading={isSaving} type="button">Save Entry</Button>
          </div>
        </div>
      </Card>

      {reflection && (
        <Card className="p-6 border-emerald-100 bg-emerald-50/50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-1">AI Insight</h3>
              <p className="text-emerald-900 italic text-lg leading-relaxed">"{reflection}"</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};