// @file utils.ts
// Core utility functions used across the application's services
// for generating IDs, formatting dates, and user management.

// @utility Generate a unique ID based on timestamp and random number
export const generateUniqueId = (prefix: string) => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// @utility Format date to ISO string but only the date part
export const formatDate = (date: Date) => date.toISOString().split('T')[0];

// @utility Get the current user ID from localStorage
import { supabase } from '@/integrations/supabase/client';

export function getCurrentUserId(): string {
  const user = supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  // Temporary solution until we fully integrate Supabase
  // In non-authenticated development environments, return a mock ID
  return user?.data?.user?.id || 'mock-user-id';
}
