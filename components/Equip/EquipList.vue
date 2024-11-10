<script setup lang="ts">
import { computed, ref } from "vue";
import Equip from "./Equip.vue";
import FilterEquips from "../Filter/FilterEquips.vue";
import Filter from "../Filter/Filter.vue";
import Confirm from "../Dialogs/Confirm.vue";
import muscle from "~/server/api/muscle";

const filter = ref<number[]>([]);
const exerciceFilter = defineModel<number[]>("filter");
const show = defineModel<showType | undefined>("show");
const searchFilter = ref<string>("");

const deleteEquipMutation = useDeleteEquip();
const showConfirmDeleteEquip = ref<boolean>(false);

const equipToDelete = ref<number>();
const deleteEquip = (id: number) => {
  deleteEquipMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteEquip.value = false),
  });
};

const props = defineProps<{
  equips: EquipType[];
  muscles: MuscleType[];
  users: UserType;
  workout: WorkoutType | undefined;
}>();

const filteredEquips = computed(() => {
  return props.equips.filter((equip) => {
    return filter.value.includes(equip.muscle_id);
    // Filter nach Muskeln
    // let muscleId;

    // if (filter.value.length !== 0) {
    //   // Finde die Muskel-ID, wenn ein Filter gesetzt ist
    //   muscleId = props.muscles.find(
    //     (muscle) => muscle.muscle_name === equip.muscle_name
    //   );
    // }
    // // console.log(muscleId);

    // // Bestimme, ob das Equipment dem Muskel-Filter entspricht
    // const matchesMuscleFilter =
    //   filter.value.length === 0 ||
    //   (muscleId !== undefined && filter.value.includes(Number(muscleId)));

    // // Filter nach Suchbegriff
    // const matchesSearchFilter =
    //   searchFilter.value === "" ||
    //   equip.equip_name
    //     .toLowerCase()
    //     .includes(searchFilter.value.toLowerCase()) ||
    //   equip.muscle_name
    //     .toLowerCase()
    //     .includes(searchFilter.value.toLowerCase());

    // return matchesMuscleFilter && matchesSearchFilter;
  });
  // @ts-ignore
  // .reduce((acc: EquipType, [id, equip]) => {
  //   // @ts-ignore
  //   acc[Number(id)] = equip;
  //   return acc;
  // }, {})
});

const sortedEquips = computed(() => {
  return filteredEquips.value.sort((a, b) => {
    return a.equip_name.localeCompare(b.equip_name);
  });
});
</script>

<template>
  <div class="relative">
    <div
      class="flex flex-col snap-y snap-mandatory bg-sonja-bg overflow-y-scroll no-scrollbar"
    >
      {{ filter }}
      <Confirm
        v-model:isOpen="showConfirmDeleteEquip"
        @yes="deleteEquip(Number(equipToDelete))"
      />
      <div
        v-for="equip in sortedEquips"
        :key="equip.equip_id"
        class="flex flex-col snap-start border-b border-sonja-akz min-w-full bg-sonja-bg cursor-pointer"
      >
        <div class="relative flex">
          <Equip :equip="equip" :users="users" :workout="workout" />
          <div class="absolute bottom-7 right-2">
            <button
              @click="
                equipToDelete = Number(equip.equip_id);
                showConfirmDeleteEquip = true;
              "
            >
              <i class="fa-solid fa-close" />
            </button>
          </div>
          <div class="ml-auto mt-auto mr-2">
            <button
              @click.prevent="
                exerciceFilter?.push(equip.equip_id);
                if (show) show.showRouter = 'exercises';
              "
            >
              <i class="fa-solid fa-chart-line" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed right-2 bottom-52 text-3xl">
      <div class="absolute right-0 bottom-10">
        <FilterEquips :equips="equips" v-model="searchFilter" />
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
