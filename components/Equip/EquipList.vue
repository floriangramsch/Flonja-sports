<script setup lang="ts">
import { computed, ref } from "vue";
import Equip from "./Equip.vue";
import FilterEquips from "../Filter/FilterEquips.vue";
import Filter from "../Filter/Filter.vue";
import Confirm from "../Dialogs/Confirm.vue";
import muscle from "~/server/api/muscle";
import { useEquipStats } from "~/composables/useEquips";

defineProps<{
  muscles: MuscleType[];
  users: UserType;
  workout: WorkoutType | undefined;
}>();

const filter = ref<number[]>([]);
const exerciceFilter = defineModel<number[]>("filter");
const show = defineModel<ShowType | undefined>("show");
const searchFilter = ref<string>("");

const deleteEquipMutation = useDeleteEquip();
const showConfirmDeleteEquip = ref<boolean>(false);

const equipToDelete = ref<number>();
const deleteEquip = (id: number) => {
  deleteEquipMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteEquip.value = false),
  });
};

const { data: equipStats } = useEquipStats();

const filteredEquips = computed(() => {
  return equipStats.value?.filter((equip) => {
    const matchesMuscleFilter =
      filter.value.length === 0 || filter.value.includes(equip.muscle_id);

    const matchesSearchFilter =
      searchFilter.value === "" ||
      equip.name.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
      equip.muscle_name
        .toLowerCase()
        .includes(searchFilter.value.toLowerCase());

    return matchesMuscleFilter && matchesSearchFilter;
  });
});

const equipList = computed<GroupedEquipStatsType[] | undefined>(() => {
  if (filteredEquips.value) {
    const groupedData = filteredEquips.value?.reduce(
      (acc: { [key: number]: any[] }, curr) => {
        const equipId = curr.equip_id;
        const userId = curr.user_id;

        // Wenn das equip_id noch nicht existiert, füge es hinzu
        if (!acc[equipId]) {
          acc[equipId] = [];
        }

        // Prüfen, ob das erste Objekt bereits für dieses equip_id existiert
        const firstEntry = acc[equipId][0];

        // Falls es das erste Element ist, fügen wir die gemeinsamen Informationen hinzu
        if (!firstEntry) {
          acc[equipId].push({
            equip_name: curr.name,
            equip_id: curr.equip_id,
            muscle_name: curr.muscle_name,
            muscle_id: curr.muscle_id,
          });
        }

        // Füge das aktuelle Element zum Array für das jeweilige equip_id hinzu
        acc[equipId].push({
          user_id: userId,
          max_weight: curr.max_weight,
          last_weight: curr.last_weight,
          user_name: curr.user_name,
        });

        return acc;
      },
      {}
    );

    // Umwandeln der Ergebnisse in ein Array von Arrays und nach Namen sortieren
    return Object.values(groupedData).sort((a, b) => {
      // TODO: variable sorting
      return a[0].equip_name.localeCompare(b[0].equip_name);
    });
  }
});
</script>

<template>
  <div class="relative">
    <div
      class="flex flex-col snap-y snap-mandatory bg-sonja-bg overflow-y-scroll no-scrollbar"
    >
      <Confirm
        v-model:isOpen="showConfirmDeleteEquip"
        @yes="deleteEquip(Number(equipToDelete))"
      />
      {{ searchFilter }}
      <div v-for="equip in equipList" class="p-1">
        <div
          class="text-2xl font-bold"
          @click.prevent="
            exerciceFilter?.push(equip[0].equip_id);
            if (show) show.showRouter = 'exercises';
          "
        >
          {{ equip[0].equip_name }} [{{ equip[0].muscle_name }}]
          <!-- Delete Equip -->
          <button
            class="ml-2"
            @click.stop="
              equipToDelete = Number(equip[0].equip_id);
              showConfirmDeleteEquip = true;
            "
          >
            <i class="fa-solid fa-close text-red-800" />
          </button>
          <!-- <button
            class="ml-2"
            @click.prevent="
              exerciceFilter?.push(equip[0].equip_id);
              if (show) show.showRouter = 'exercises';
            "
          >
            <i class="fa-solid fa-chart-line" />
          </button> -->
        </div>
        <div v-for="user in equip.slice(1)" class="flex gap-2">
          <div>{{ user.user_name }}:</div>
          <div>PB {{ user.max_weight }}</div>
          <div>Last {{ user.last_weight }}</div>
        </div>
      </div>
    </div>

    <div class="fixed right-2 bottom-52 text-3xl">
      <div class="absolute right-0 bottom-10">
        <FilterEquips v-model="searchFilter" />
      </div>
      <div class="absolute right-0 bottom-0">
        <Filter
          :data="
            muscles.map((muscle) => ({
              id: muscle.muscle_group_id,
              name: muscle.muscle_name,
            }))
          "
          v-model="filter"
        />
      </div>
    </div>
  </div>
</template>
