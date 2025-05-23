
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

export async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user.id;
}
