<script setup lang="ts">
// Notifications
const registration = await navigator.serviceWorker.getRegistration();
if (!registration) {
  console.error("Service Worker nicht registriert.");
}

const sendNotification = async () => {
  if (Notification.permission === "granted") {
    showNotification("test");
  } else {
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        showNotification("test");
      }
    }
  }
};

const showNotification = (body: string) => {
  const title = "What PWA Can Do Today";

  const payload = {
    body,
  };

  if (registration && "showNotification" in registration) {
    registration.showNotification(title, payload);
  } else {
    new Notification(title, payload);
  }
};

const props = defineProps<{
  start: boolean;
}>();

const emit = defineEmits<{
  (e: "stop"): void;
}>();

const notification = ref<string>();

const time = ref<number>(0);
const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60000);
  const seconds = Math.floor((time.value % 60000) / 1000);
  const milliseconds = Math.floor((time.value % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${String(milliseconds).padStart(2, "0")}`;
});
let interval: ReturnType<typeof setInterval> | undefined;

watch(
  () => props.start,
  (newVal) => {
    time.value = 0;
    if (newVal) {
      notification.value = undefined;
      interval = setInterval(() => {
        time.value += 10;
        if (time.value >= 120000) {
          notification.value = "2 Minuten erreicht";
          time.value = 0;
          clearInterval(interval);
          emit("stop");
        }
      }, 10);
    } else {
      clearInterval(interval);
    }
  }
);

onUnmounted(() => {
  clearInterval(interval);
});
</script>
<template>
  <div class="w-full flex justify-center p-2">
    {{ formattedTime }}
  </div>
  <div>
    {{ notification }}
  </div>

  <button @click="emit('stop')">{{ !start ? "Start" : "Stop" }}</button>

  <button @click="sendNotification">Note</button>
</template>
