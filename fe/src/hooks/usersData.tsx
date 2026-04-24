
import { useQuery } from "@tanstack/react-query";
import api from "../api/config";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],

    queryFn: async () => {


      const response = await api.get("/auth/users", {
       
      });

      return response.data;
    },

    staleTime: 1000 * 60 * 10, // 10 mins
    gcTime: 1000 * 60 * 30, // 30 mins cache
    refetchOnWindowFocus: false,
  });
};