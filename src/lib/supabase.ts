import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfgtubtvszwipcisnlok.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZ3R1YnR2c3p3aXBjaXNubG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDAyODQsImV4cCI6MjA4Nzk3NjI4NH0.Z7XYS5_kcCakyNkbMG8BLgTepYjRgrsUx6cw4XtddzM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');