<script setup lang="ts">
import { computed } from "vue";
import Filter from "../Filter/Filter.vue";

const equips = defineModel<EquipType[]>();

const { data: sets } = useGetSets();

const filter = defineModel<number[]>("filter");

const filtered = computed(() => {
  return sets.value?.filter(
    (equip: any) =>
      filter.value?.length === 0 ||
      filter.value?.includes(Number(equip.equip_id))
  );
});
</script>

<template>
  <div>
    <div class="bg-sonja-bg text-sonja-text">
      <div
        v-for="equip in filtered"
        class="p-1 border-b border-sonja-akz"
        :key="equip.equip_id"
      >
        {{ equip.equip_name }}
        <div v-for="user in equip.users" class="flex flex-wrap">
          <div class="mr-1">{{ user.user_name }}:</div>
          <div v-for="(set, index) in user.sets" class="flex">
            {{ set.weight }}
            <div v-if="set.reps">({{ set.reps }})</div>
            <i
              v-if="index !== user.sets.length - 1"
              class="fa-solid fa-arrow-right"
            />
            <!-- {{ set.start }} -->
          </div>
        </div>
      </div>
    </div>

    <div class="fixed right-2 bottom-52 text-3xl">
      <div class="absolute right-0 bottom-0">
        <Filter
          :data="
            equips?.map((equip) => ({
              id: equip.equip_id,
              name: equip.equip_name,
            }))
          "
          v-model="filter"
        />
      </div>
    </div>
  </div>
</template>
