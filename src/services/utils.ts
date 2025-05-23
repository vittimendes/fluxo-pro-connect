
// @file utils.ts
// Core utility functions used across the application's services
// for generating IDs, formatting dates, and user management.

// @utility Generate a unique ID based on timestamp and random number
export const generateUniqueId = (prefix: string) => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// @utility Format date to ISO string but only the date part
export const formatDate = (date: Date) => date.toISOString().split('T')[0];

// @utility Get the current user ID from Supabase
import { supabase } from '@/integrations/supabase/client';

// Synchronous version that gets user ID from local storage
// This is used for non-async contexts where we need the ID immediately
export function getCurrentUserIdSync(): string {
  try {
    // Try to get the user from existing session in localStorage
    const localStorageSession = localStorage.getItem('supabase.auth.token');
    if (localStorageSession) {
      const session = JSON.parse(localStorageSession);
      if (session?.user?.id) {
        return session.user.id;
      }
    }
    
    // Fallback to getting the current user from the Supabase client's cache
    const user = supabase.auth.user();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return user.id;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    throw new Error("User not authenticated");
  }
}

// Async version that gets user ID from Supabase auth
export async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user.id;
}
