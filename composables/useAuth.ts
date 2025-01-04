import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: { username: string; password: string }) => {
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: userData,
      });
      return response;
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      });
      if ("result" in response && response.result) {
        localStorage.setItem("fitty_token", response.token);
        const loggedStore = useLoggedStore();
        loggedStore.setUser(response.id, response.username);
      } else {
        localStorage.removeItem("fitty_token");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isLogged"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

export const useCheckLogin = () => {
  return useQuery({
    queryKey: ["isLogged"],
    queryFn: async () => {
      console.log("test");
      const token = localStorage.getItem("fitty_token");
      if (!token) return false;
      const res = await fetch("/api/auth/checkLogin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.id && data.username) {
        const loggedStore = useLoggedStore();
        loggedStore.setUser(data.id, data.username);
      }
      return res.json();
    },
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};
