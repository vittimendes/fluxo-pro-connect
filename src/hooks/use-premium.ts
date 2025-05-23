
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export function usePremium() {
  const { user } = useSupabaseAuth();
  
  // Get premium status from user metadata if available
  const userPlan = user?.user_metadata?.plan;
  
  // Simulate premium status based on user's email domain or metadata
  const isPro = 
    userPlan === 'pro' || 
    user?.email?.includes('@pro.com') || 
    false;
  
  return {
    isPremium: isPro,
    plan: isPro ? 'pro' : 'free'
  };
}
