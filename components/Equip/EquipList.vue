<template>
  <div
    class="flex flex-col snap-y snap-mandatory bg-sonja-fg overflow-y-scroll no-scrollbar"
    :class="Object.keys(filteredEquips).length > 5 ? 'mb-20' : 'mb-0'"
  >
    <div
      v-for="(equip, id) in sortedEquips"
      :key="id"
      class="flex flex-col snap-start border-b border-sonja-akz min-w-full bg-sonja-fg cursor-pointer"
    >
      <div class="flex">
        <Equip
          :equip="{ ...equip, id: Number(id) }"
          :users="users"
          :workout="workout"
        />
        <div class="ml-auto mt-auto mr-2">
          <button
            @click.prevent="
              exerciceFilter?.push(Number(id));
              showRouter = 'exercises';
            "
          >
            <i class="fa-solid fa-chart-line" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="absolute right-2 bottom-52 text-3xl">
    <div class="absolute right-0 bottom-10">
      <FilterEquips :equips="equips" v-model="searchFilter" />
    </div>
    <div class="absolute right-0 bottom-0">
      <Filter :data="muscles" display-prop="muscle_name" v-model="filter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Equip from "./Equip.vue";
import FilterEquips from "../Filter/FilterEquips.vue";
import Filter from "../Filter/Filter.vue";

const filter = ref<number[]>([]);
const exerciceFilter = defineModel<number[]>("filter");
const showRouter = defineModel<string>("showRouter");
const searchFilter = ref<string>("");

const props = defineProps<{
  equips: EquipType;
  muscles: MuscleType;
  users: UserType;
  workout: LoggedWorkout | undefined;
}>();

const filteredEquips = computed(() => {
  return Object.entries(props.equips)
    .filter(([id, equip]) => {
      // Filter nach Muskeln
      let muscleId;

      if (filter.value.length !== 0) {
        // Finde die Muskel-ID, wenn ein Filter gesetzt ist
        muscleId = Object.keys(props.muscles).find(
          (key) =>
            props.muscles[Number(key)].muscle_name === equip.equip_muscle_name
        );
      }

      // Bestimme, ob das Equipment dem Muskel-Filter entspricht
      const matchesMuscleFilter =
        filter.value.length === 0 ||
        (muscleId !== undefined && filter.value.includes(Number(muscleId)));

      // Filter nach Suchbegriff
      const matchesSearchFilter =
        searchFilter.value === "" ||
        equip.equip_name
          .toLowerCase()
          .includes(searchFilter.value.toLowerCase()) ||
        equip.equip_muscle_name
          .toLowerCase()
          .includes(searchFilter.value.toLowerCase());

      return matchesMuscleFilter && matchesSearchFilter;
    })
    .reduce((acc: EquipType, [id, equip]) => {
      acc[Number(id)] = equip;
      return acc;
    }, {});
});

const sortedEquips = computed(() => {
  return Object.fromEntries(
    Object.entries(filteredEquips.value).sort(([, a], [, b]) => {
      return a.equip_name.localeCompare(b.equip_name);
      // return a.FloPB - b.FloPB;
    })
  );
});
</script>
