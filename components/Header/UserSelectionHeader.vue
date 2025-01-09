<script setup lang="ts">
const { data: users } = useUsers();

const selected = ref<number>(0);

const containerRef = ref<HTMLDivElement | null>(null);
const isAtStart = ref(false);
const isAtEnd = ref(false);

const scrollLeft = () => {
  if (containerRef.value) {
    containerRef.value.scrollBy({ left: -100, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (containerRef.value) {
    containerRef.value.scrollBy({ left: 100, behavior: "smooth" });
  }
};

const checkScrollPosition = () => {
  // if (containerRef.value) {
  //   isAtStart.value = containerRef.value.scrollLeft === 0;
  //   isAtEnd.value =
  //     containerRef.value.scrollLeft + containerRef.value.clientWidth >=
  //     containerRef.value.scrollWidth;
  // }
};

defineExpose({ selected });
</script>

<template>
  <div class="flex items-center">
    <button @click="scrollLeft" class="p-2" :class="{ hidden: isAtStart }">
      <i class="fa-solid fa-chevron-left" />
    </button>
    <div
      ref="containerRef"
      class="noscrollbar flex overflow-x-scroll text-base w-full"
      @scroll="checkScrollPosition"
    >
      <div
        class="mx-1 cursor-pointer rounded px-2 py-1 shadow"
        :class="{
          'bg-sonja-akz': selected === 0,
          'bg-sonja-text text-sonja-akz2': selected !== 0,
        }"
        @click.stop="selected = 0"
      >
        Alle
      </div>
      <div
        v-for="user in users"
        :key="user.user_id"
        class="mx-1 cursor-pointer rounded px-2 py-1 shadow"
        :class="{
          'bg-sonja-akz': selected === user.user_id,
          'bg-sonja-text text-sonja-akz2': selected !== user.user_id,
        }"
        @click.stop="selected = user.user_id"
      >
        {{ user.name }}
      </div>
    </div>
    <button @click="scrollRight" class="p-2" :class="{ hidden: isAtEnd }">
      <i class="fa-solid fa-chevron-right" />
    </button>
  </div>
</template>

<style scoped>
.noscrollbar::-webkit-scrollbar {
  display: none;
}
.noscrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
