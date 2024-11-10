<template>
  <div>
    <div class="bg-sonja-bg text-sonja-text">
      <template v-if="filtered?.length !== 0">
        <div
          v-for="equip in filtered"
          :key="equip.equip_id"
          class="border-b border-sonja-akz"
        >
          {{ equip.equip_name }}
          <!-- <div v-for="(user, user_id) in equip.exercises" :key="user_id">
            {{ getUserName(Number(user_id)) }}
            <div v-for="exercise in user" :key="exercise.id">
              {{ exercise.weight }} kg am {{ formatTime(exercise.start) }}
            </div>
          </div> -->
        </div>
      </template>
      <template v-else>
        <div class="text-center">Filter nach etwas!</div>
      </template>
    </div>

    <div class="fixed right-2 bottom-52 text-3xl">
      <div class="absolute right-0 bottom-0">
        <Filter :data="equips" display-prop="equip_name" v-model="filter" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Filter from "../Filter/Filter.vue";

const equips = defineModel<EquipType[]>();

const props = defineProps<{
  users: any;
}>();

const filter = defineModel<number[]>("filter");

const filtered = computed(() => {
  return equips.value?.filter((equip) =>
    filter.value?.includes(Number(equip.equip_id))
  );
});

const getUserName = (id: number) => {
  const user = props.users.find((user: any) => user.user_id === id);
  return user ? user.name : "Unknown";
};
</script>
