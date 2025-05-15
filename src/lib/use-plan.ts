
import { useAuth } from "@/contexts/AuthContext";

export const useIsPro = () => {
  const { currentUser } = useAuth();
  return currentUser?.plan === "pro";
};
