<template>
  <div class="bg-sonja-fg text-sonja-text">
    <template v-if="Object.keys(filtered).length !== 0">
      <div
        v-for="equip in filtered"
        :key="equip.id"
        class="border-b border-sonja-akz"
      >
        {{ equip.equip_name }}
        <div v-for="(exercise, user_id) in equip.exercises" :key="user_id">
          <!-- Überprüfen, ob der Benutzer existiert -->
          <div v-if="users[user_id]">
            {{ users[user_id].name }}
            <div v-for="user in exercise" :key="user.id">
              {{ user.weight }} kg am {{ formatTime(user.start) }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center">Filter nach etwas!</div>
    </template>
  </div>

  <div class="absolute right-2 bottom-52 text-3xl">
    <div class="absolute right-0 bottom-0">
      <Filter :data="equips" display-prop="equip_name" v-model="filter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Filter from "../Filter/Filter.vue";

// const filter = ref<number[]>([]);
const equips = defineModel<EquipType>();

defineProps<{
  users: UserType;
}>();

const filter = defineModel<number[]>("filter");

const filtered = computed(() => {
  const validEquips = equips.value ?? {};
  return Object.fromEntries(
    Object.entries(validEquips).filter(([id, equip]) =>
      filter.value?.includes(Number(id))
    )
  );
});
</script>
