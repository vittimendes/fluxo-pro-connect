
// @file use-plan.ts
// Custom hook for checking if the current user has a pro subscription plan.

import { useAuth } from "@/contexts/AuthContext";

// @function Hook that checks if the current user is on a pro plan
export const useIsPro = () => {
  const { currentUser } = useAuth();
  return currentUser?.plan === "pro";
};
