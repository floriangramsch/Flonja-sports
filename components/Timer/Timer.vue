<script setup lang="ts">
// Notifications
const registration = await navigator.serviceWorker.getRegistration();
if (!registration) {
  console.error("Service Worker nicht registriert.");
}

const sendNotification = async (message: string) => {
  if (Notification.permission === "granted") {
    showNotification(message);
  } else {
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        showNotification(message);
      }
    }
  }
};

const showNotification = (body: string) => {
  const title = "Pause vorbei!";

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

const startTime = ref<number | null>(null);

watch(
  () => props.start,
  (newVal) => {
    if (newVal) {
      notification.value = undefined;
      startTime.value = Date.now();
      interval = setInterval(() => {
        if (startTime.value !== null) {
          const elapsedTime = Date.now() - startTime.value;
          time.value = elapsedTime;
          if (elapsedTime >= 3000) {
            notification.value = "2 Minuten erreicht";
            sendNotification("2 Minuten erreicht");
            clearInterval(interval);
            emit("stop");
          }
        }
      }, 100);
    } else {
      clearInterval(interval);
      startTime.value = null;
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

  <button @click="sendNotification('Hallo Se bebi!')">Note</button>
</template>
