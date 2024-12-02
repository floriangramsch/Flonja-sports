<script setup lang="ts">
import { computed } from "vue";
import Filter from "../Filter/Filter.vue";
import ExerciseChart from "../Charts/ExerciseChart.vue";

const equips = defineModel<EquipType[]>();

const { data: sets } = useGetSets();

const filter = defineModel<number[]>("filter");

const filtered = computed(() => {
  return sets.value?.filter(
    (equip: any) =>
      filter.value?.length === 0 ||
      filter.value?.includes(Number(equip.equip_id)),
  );
});

const filterWrapperComponent = ref<InstanceType<typeof Filter> | null>(null);

const showLegacy = ref<boolean>(false);
</script>

<template>
  <div class="bg-sonja-bg text-sonja-text">
    <!-- Header -->
    <div class="flex w-full justify-evenly px-2 py-4">
      <div class="text-center text-4xl font-bold">Exercise List</div>
      <button
        class="absolute right-3 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="filterWrapperComponent?.toggle"
      >
        <i class="fa-solid fa-filter" />
      </button>
    </div>

    <FilterWrapper ref="filterWrapperComponent">
      <Filter
        :data="
          equips?.map((equip: EquipType) => ({
            id: equip.equip_id,
            name: equip.equip_name,
          }))
        "
        v-model="filter"
      />
      <button
        class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="showLegacy = !showLegacy"
      >
        <i class="fa-solid fa-barcode" />
      </button>
    </FilterWrapper>

    <!-- Exercise List -->
    <div v-for="equip in filtered" class="p-1" :key="equip.equip_id">
      <div class="font-bold">
        {{ equip.equip_name }}
      </div>
      <div v-for="user in equip.users" class="flex flex-wrap">
        <ChartsExerciseChart :user="user.user_name" :data="user.sets" />
        <div v-if="showLegacy" v-for="(set, index) in user.sets" class="flex">
          <div class="mx-2 flex">
            <div v-if="set.reps">{{ set.reps }}</div>
            <div>@{{ set.weight }}</div>
          </div>
          <i
            v-if="index !== user.sets.length - 1"
            class="fa-solid fa-arrow-right"
          />
        </div>
      </div>
    </div>
  </div>
</template>
