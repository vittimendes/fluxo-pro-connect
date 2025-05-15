
import { useAuth } from '@/contexts/AuthContext';
import { useIsPro } from '@/lib/use-plan';

export function usePremium() {
  const { currentUser } = useAuth();
  const isPro = useIsPro();
  
  return {
    isPremium: isPro,
    plan: currentUser?.plan || 'free'
  };
}
