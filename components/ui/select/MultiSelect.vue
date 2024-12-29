<script setup lang="ts">
defineProps<{
  default?: string;
  name?: string;
  options: { value: number; label: string }[];
}>();

const model = defineModel<number[]>();

const isOpen = ref<boolean>(false);

const select = (id: number) => {
  const index = model.value?.indexOf(id);
  if (index !== -1 && index !== undefined) {
    model.value?.splice(index, 1);
  } else {
    model.value?.push(id);
  }
};
</script>

<template>
  <!-- tags -->
  <div class="relative">
    <div
      :id="name"
      class="flex w-full gap-1 overflow-auto rounded-md bg-sonja-text p-2 text-sonja-akz2 focus:outline-none focus:ring-2 focus:ring-sonja-akz"
      @click="isOpen = !isOpen"
    >
      <div
        v-if="model && model.length !== 0"
        v-for="c in model"
        class="text-nowrap rounded bg-sonja-akz p-[2px] text-sm text-sonja-text"
      >
        {{ options.find((opt) => opt.value === c)?.label }}
      </div>
      <div v-else>{{ name }}</div>
    </div>
    <label
      :for="name"
      class="absolute right-2 top-0 -translate-y-1/2 rounded bg-sonja-akz p-[2px] text-xs text-black transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-base peer-placeholder-shown:text-sonja-akz2 peer-focus:top-0 peer-focus:rounded peer-focus:bg-sonja-akz peer-focus:p-[2px] peer-focus:text-xs peer-focus:text-sonja-text peer-focus:shadow"
    >
      {{ name }}
    </label>

    <!-- options -->
    <div
      v-if="isOpen"
      class="absolute top-10 z-50 rounded bg-sonja-fg py-2 text-sonja-akz2 shadow"
      >
      <div
        v-for="opt in options"
        :key="opt.value"
        class="hover:bg-sonja-akz p-1 px-2"
        :class="{ 'bg-sonja-akz text-sonja-text': model?.includes(opt.value) }"
        @click.stop="select(opt.value)"
      >
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>
