
import { supabase } from '@/integrations/supabase/client';

// Generate a unique ID with an optional prefix
export const generateUniqueId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}`;
};

// Format a date to YYYY-MM-DD string
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current logged in user's ID from localStorage
// This is synchronous so can be used in places where we can't await
export const getCurrentUserIdSync = (): string => {
  const currentUserJson = localStorage.getItem('currentUser');
  if (currentUserJson) {
    try {
      const currentUser = JSON.parse(currentUserJson);
      return currentUser.id;
    } catch (e) {
      console.error('Error parsing user data from localStorage', e);
      return 'user_default'; // Fallback user ID
    }
  }
  
  // Get user ID from Supabase session as fallback
  const session = supabase.auth.getSession().data?.session;
  if (session?.user?.id) {
    return session.user.id;
  }
  
  return 'user_default'; // Fallback user ID if not found
};

// Get current logged in user's ID (async version)
export const getCurrentUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    return session.user.id;
  }
  
  // Fallback to localStorage if Supabase session not available
  const currentUserJson = localStorage.getItem('currentUser');
  if (currentUserJson) {
    try {
      const currentUser = JSON.parse(currentUserJson);
      return currentUser.id;
    } catch (e) {
      console.error('Error parsing user data from localStorage', e);
    }
  }
  
  return 'user_default'; // Fallback user ID
};
