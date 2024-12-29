<script setup lang="ts">
import Header from "./Header/Header.vue";
</script>

<template>
  <Header
    @left="console.log('left')"
    @right="console.log('right')"
    leftIcon="fa-solid fa-filter"
    rightIcon="fa-solid fa-filter"
  >
    Exercise List
  </Header>
</template>

<!-- <script setup lang="ts">
import { ref } from "vue";

const data = ref([
  {
    id: 1,
    content: "Test1",
  },
  {
    id: 2,
    content: "Test2",
  },
  {
    id: 3,
    content: "Test3",
  },
]);

const isDragging = ref(false);
const dragElement = ref<HTMLElement | null>(null);
const offsetX = ref(0);
const offsetY = ref(0);

const startMoving = (e: MouseEvent | TouchEvent, element: HTMLElement) => {
  isDragging.value = true;
  dragElement.value = element;
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  offsetX.value = clientX - element.getBoundingClientRect().left;
  offsetY.value = clientY - element.getBoundingClientRect().top;
};

const moveElement = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !dragElement.value) return;
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  dragElement.value.style.position = "absolute";
  dragElement.value.style.left = `${clientX - offsetX.value}px`;
  dragElement.value.style.top = `${clientY - offsetY.value - 80}px`;
  dragElement.value.style.width = `100%`;
};

const stopMoving = (e: MouseEvent | TouchEvent) => {
  isDragging.value = false;
  if (dragElement.value) {
    const clientX =
      e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
    const clientY =
      e instanceof MouseEvent ? e.clientY : e.changedTouches[0].clientY;

    dragElement.value.style.visibility = 'hidden';
    const belowId = document.elementFromPoint(clientX, clientY)?.id;
    dragElement.value.style.visibility = 'visible';
    const holdingId = (e.target as HTMLElement)?.id;
    dragElement.value.style.position = "static";

    const holdingIndex = data.value.findIndex(
      (item) => item.id === Number(holdingId),
    );

    console.log("key", holdingId);
    console.log("Element below:", belowId);
    if (holdingId === belowId || belowId === null) return;
    const tmp = data.value.find((item) => item.id === Number(holdingId));
    data.value = data.value.filter((item) => item.id !== Number(holdingId));
    if (!tmp) return;

    const belowIndex = data.value.findIndex(
      (item) => item.id === Number(belowId),
    );
    console.log("keyIndex", holdingIndex);
    console.log("Element below Index:", belowIndex);
    data.value.splice(Number(belowIndex)+1, 0, tmp);
  }
  dragElement.value = null;
};

const showData = () => {
  let i = 1;
  data.value.map(el => {
    el.id = i;
    i++
  })
  for (let index = 0; index < data.value.length; index++) {
    const element = data.value[index];
    console.log(element.id, element.content)
  }
}

document.addEventListener("mousemove", moveElement);
document.addEventListener("mouseup", stopMoving);
document.addEventListener("touchmove", moveElement);
document.addEventListener("touchend", stopMoving);
</script>

<template>
  <div class="p-1">
    <div
      v-for="c in data"
      :key="c.id"
      :id="String(c.id)"
      class="cursor-move border p-1"
      @mousedown="startMoving($event, $event.target as HTMLElement)"
      @touchstart="startMoving($event, $event.target as HTMLElement)"
    >
      {{ c.content }}
    </div>
    <button @click="showData">Test</button>
  </div>
</template> -->
