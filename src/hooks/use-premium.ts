
import { useAuth } from '@/contexts/AuthContext';

export function usePremium() {
  const { user } = useAuth();
  
  const isPremium = user?.plan === 'pro';
  
  return {
    isPremium,
    plan: user?.plan || 'free'
  };
}
