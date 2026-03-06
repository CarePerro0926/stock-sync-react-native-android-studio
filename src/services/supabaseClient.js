// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://vdprbdudjoqiptxavzmt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkcHJiZHVkam9xaXB0eGF2em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzM5NDQsImV4cCI6MjA3Njc0OTk0NH0.9sogcsR0gTaTe6nRsrsDxn8juj_atjw0PSxNWG-TAUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
