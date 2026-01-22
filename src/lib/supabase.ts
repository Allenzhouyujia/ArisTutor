import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dghgfkgaznqqzdgyvrai.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaGdma2dhem5xcXpkZ3l2cmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgzMTAsImV4cCI6MjA4NDYwNDMxMH0.PyjJS7Nv7BTiOO1DHiQh7CrG7KDl86zP7iy1T5PeDb0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { User } from '@supabase/supabase-js';



