import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export default function useEquips() {
  return useQuery<EquipType>({
    queryKey: ["equips"],
    queryFn: fetchEquipment,
  });
}

export const useAddEquips = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEquip: { name: string; muscleGroupId: number }) => {
      const response = await fetch("/api/equip", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEquip),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equips"] });
    },
  });
};
