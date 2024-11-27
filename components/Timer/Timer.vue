<script setup lang="ts">
// Props und Events definieren
const props = defineProps<{
  isActive: boolean;
}>();
const emit = defineEmits<{
  (e: "stopped"): void;
}>();

// Timer-Logik
const startTime = ref<number | null>(null);
const remainingTime = ref<number>(120000); // 2 Minuten in Millisekunden

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60000);
  const seconds = Math.floor((remainingTime.value % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
});

let interval: ReturnType<typeof setInterval> | undefined;

const startTimer = async () => {
  if (!startTime.value) {
    startTime.value = Date.now();
    // sendTimerToSW(remainingTime.value); // Service Worker Timer starten
    sendTimerToSW(3333); // Service Worker Timer starten
  }

  interval = setInterval(() => {
    if (startTime.value) {
      const elapsed = Date.now() - startTime.value;
      remainingTime.value = Math.max(120000 - elapsed, 0);

      if (remainingTime.value <= 0) {
        clearInterval(interval);
        startTime.value = null;
        remainingTime.value = 120000;
      }
    }
  }, 100);
};

const stopTimer = () => {
  clearInterval(interval);
  startTime.value = null;
  remainingTime.value = 120000;
  emit("stopped");
};

// Nachricht an den Service Worker schicken
const sendTimerToSW = async (delay: number) => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && registration.active) {
    registration.active.postMessage({ action: "startTimer", delay });
  }
};

// Seite reagiert auf Standby/Tabwechsel
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && startTime.value) {
    const elapsed = Date.now() - startTime.value;
    remainingTime.value = Math.max(120000 - elapsed, 0);
  }
});

// Reaktion auf Änderungen von außen
watch(
  () => props.isActive,
  (newValue) => {
    if (newValue) {
      startTimer();
    } else {
      stopTimer();
    }
  }
);

// Timer aufräumen, wenn die Komponente entladen wird
onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div>
    <h1>Timer</h1>
    <p>{{ formattedTime }}</p>
    <button @click="startTimer">Start</button>
    <button @click="stopTimer">Stop</button>
  </div>
</template>
