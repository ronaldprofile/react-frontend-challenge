import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/features/auth/store/authStore";

export function useLogout() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate({ to: "/login" });
  };
}
