
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export function usePremium() {
  const { user } = useSupabaseAuth();
  
  // Simulate premium status based on user's email domain
  // This is a simple implementation that can be expanded later
  const isPro = user?.email?.includes('@pro.com') || false;
  
  return {
    isPremium: isPro,
    plan: isPro ? 'pro' : 'free'
  };
}
