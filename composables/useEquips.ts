import { useQuery } from "@tanstack/vue-query";

export default function useEquips() {
  return useQuery<EquipType>({
    queryKey: ["equips"],
    queryFn: fetchEquipment,
  });
}
