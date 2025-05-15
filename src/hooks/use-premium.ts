
import { useAuth } from '@/contexts/AuthContext';
import { useIsPro } from '@/lib/use-plan';

export function usePremium() {
  const { user } = useAuth();
  const isPro = useIsPro();
  
  return {
    isPremium: isPro,
    plan: user?.plan || 'free'
  };
}
