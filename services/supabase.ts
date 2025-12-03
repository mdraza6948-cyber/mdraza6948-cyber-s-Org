import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxzldvrazubspvxpfvjf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4emxkdnJhenVic3B2eHBmdmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzU4OTEsImV4cCI6MjA4MDMxMTg5MX0.V0OKQeyJF6sBPAbZLLkSKmIoDpYaIH58tmAtkeSij6c';

export const supabase = createClient(supabaseUrl, supabaseKey);