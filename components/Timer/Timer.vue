<script setup lang="ts">
// Notifications
const registration = await navigator.serviceWorker.getRegistration();
if (!registration) {
  console.error("Service Worker nicht registriert.");
}

// Props und Events definieren
const props = defineProps<{
  isActive: boolean;
  userId: number;
  restTime: number;
}>();
const emit = defineEmits<{
  (e: "stopped"): void;
}>();

// Timer-Logik
const startTime = ref<number | null>(null);
const restTimeInput = ref<string>(formatTime(props.restTime));
const remainingTime = ref<number>(props.restTime);
const showAdjustRestTime = ref<boolean>(false);

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60000);
  const seconds = Math.floor((remainingTime.value % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
});

let interval: ReturnType<typeof setInterval> | undefined;

const startTimer = async (event?: MouseEvent, time?: number) => {
  const restTime = time ? time : props.restTime
  if (time) {
    remainingTime.value = time
  }
  if (!startTime.value) {
    startTime.value = Date.now();
    sendTimerToSW(restTime); // Service Worker Timer starten
  }

  interval = setInterval(() => {
    if (startTime.value) {
      const elapsed = Date.now() - startTime.value;
      remainingTime.value = Math.max(restTime - elapsed, 0);

      if (remainingTime.value <= 0) {
        stopTimer();
      }
    }
  }, 100);
};

const stopTimer = () => {
  clearInterval(interval);
  startTime.value = null;
  remainingTime.value = props.restTime;
  emit("stopped");
};

// Dont notify
const interuptTimer = async () => {
  stopTimer();
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && registration.active) {
    registration.active.postMessage({ action: "interuptTimer" });
  }
};

const updateRestTimeMutation = useUpdateUser();
const changeRestTime = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const [minutes, seconds] = target.value.split(":");
  let millis;
  if (Number(minutes) === 0 && Number(seconds) === 0) {
    millis = 120000;
  } else {
    millis = parseInt(minutes) * 60000 + parseInt(seconds) * 1000;
  }
  updateRestTimeMutation.mutate(
    { user_id: props.userId, rest_time: millis },
    {
      onSuccess: () => {
        remainingTime.value = millis;
      },
    },
  );
};

// Nachricht an den Service Worker schicken
const sendTimerToSW = async (delay: number) => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (Notification.permission === "granted") {
    if (registration && registration.active) {
      registration.active.postMessage({ action: "startTimer", delay });
    }
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      if (registration && registration.active) {
        registration.active.postMessage({ action: "startTimer", delay });
      }
    } else {
      console.error("Benachrichtigungen wurden abgelehnt.");
    }
  } else {
    console.error("Benachrichtigungen wurden bereits abgelehnt.");
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
    newValue ? startTimer() : stopTimer();
  },
);

// Timer aufräumen, wenn die Komponente entladen wird
onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="flex w-full justify-center gap-3 text-2xl z-50">
    <div v-if="startTime">
      {{ formattedTime }}
    </div>
    <!-- <DialogsDialog
      :is-open="showAdjustRestTime"
      @close="showAdjustRestTime = false"
    >
      <template v-slot:trigger>
        <div @click="showAdjustRestTime = true">
          {{ formattedTime }}
        </div>
      </template>
      <div class="flex w-full justify-center">
        <input
          type="time"
          min="00:01"
          v-model="restTimeInput"
          @change="changeRestTime"
          class="dark:yellow flex justify-center rounded bg-sonja-text p-4 text-3xl text-sonja-akz2 shadow focus:outline-none focus:ring-1 focus:ring-sonja-akz"
        />
      </div>
    </DialogsDialog> -->
    <button v-if="!startTime" @click="(event) => startTimer(event, 30000)">
      <i class="fa-solid fa-3 text-xl" />
      <i class="fa-solid fa-0 text-xl" />
    </button>
    <button v-if="!startTime" @click="(event) => startTimer(event, 90000)">
      <i class="fa-solid fa-9 text-xl" />
      <i class="fa-solid fa-0 text-xl" />
    </button>
    <button v-if="!startTime" @click="(event) => startTimer(event, 120000)">
      <i class="fa-solid fa-1 text-xl" />
      <i class="fa-solid fa-2 text-xl" />
      <i class="fa-solid fa-0 text-xl" />
    </button>
    <!-- <button v-if="!startTime" @click="(event) => startTimer(event)">
      <i class="fa-solid fa-play" />
    </button> -->
    <button v-if="startTime" @click="interuptTimer">
      <i class="fa-solid fa-stop" />
    </button>
  </div>
</template>
