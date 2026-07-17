<script setup lang="ts">
const emit = defineEmits<{
  (e: "selectPlan", plan: Plan): void;
}>();

const loggedStore = useLoggedStore();

const { data: plans } = usePlan();

const weekDays = computed(() => {
  const days = [];
  const labels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const start = getStartOfWeek(new Date());

  for (let i = 0; i < 7; i++) {
    const dayIndex = i + 1;
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dayPlans =
      plans.value?.filter(
        (p) =>
          p.days?.includes(dayIndex) &&
          p.user_id === loggedStore.logged.user.id,
      ) || [];

    days.push({
      dayIndex,
      date,
      label: labels[i],
      plans: dayPlans,
    });
  }
  return days;
});

const todayIndex = ((new Date().getDay() + 6) % 7); // Mo=0, Di=1, ..., So=6
const activeDayIndex = ref(todayIndex);

const goToDay = (index: number) => {
  activeDayIndex.value = index;
};

const prevDay = () => {
  if (activeDayIndex.value > 0) activeDayIndex.value--;
};

const nextDay = () => {
  if (activeDayIndex.value < 6) activeDayIndex.value++;
};

const touchStartX = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchEnd = (e: TouchEvent) => {
  if (swipingPlanId.value !== null) return;
  const delta = e.changedTouches[0].clientX - touchStartX.value;
  if (delta > 50 && activeDayIndex.value > 0) {
    activeDayIndex.value--;
  } else if (delta < -50 && activeDayIndex.value < 6) {
    activeDayIndex.value++;
  }
};

const fullDayLabels = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag",
  "Freitag", "Samstag", "Sonntag",
];

const selectedDayIndex = ref<number | null>(null);
const showAssignDialog = ref(false);

const openAssign = (dayIndex: number) => {
  selectedDayIndex.value = dayIndex;
  showAssignDialog.value = true;
};

const togglePlanDay = useTogglePlanDay();

const toggleDayPlan = (planId: number, day: number, isAssigned: boolean) => {
  delete swipeOffsets.value[planId];
  togglePlanDay.mutate({ id: planId, day, remove: isAssigned });
};

const swipeOffsets = ref<Record<number, number>>({});
const swipeStartX = ref<number | null>(null);
const swipingPlanId = ref<number | null>(null);

const cardTouchStart = (e: TouchEvent, planId: number) => {
  swipeStartX.value = e.touches[0].clientX;
  swipingPlanId.value = planId;
  swipeOffsets.value[planId] = 0;
};

const cardTouchMove = (e: TouchEvent, planId: number) => {
  if (swipingPlanId.value !== planId || swipeStartX.value === null) return;
  const delta = e.touches[0].clientX - swipeStartX.value;
  if (delta < 0) {
    swipeOffsets.value[planId] = delta;
  } else {
    swipeOffsets.value[planId] = 0;
  }
};

const cardTouchEnd = (e: TouchEvent, planId: number, dayIndex: number) => {
  if (swipingPlanId.value !== planId || swipeStartX.value === null) return;
  const delta = e.changedTouches[0].clientX - swipeStartX.value;
  if (delta < -80) {
    toggleDayPlan(planId, dayIndex, true);
  } else {
    swipingPlanId.value = null;
    swipeOffsets.value[planId] = 0;
  }
  swipeStartX.value = null;
};

const allUserPlans = computed(() => {
  return (
    plans.value?.filter(
      (p) => p.user_id === loggedStore.logged.user.id,
    ) || []
  );
});

const carouselRef = ref<HTMLElement>();
const carouselWidth = ref(0);

onMounted(() => {
  if (carouselRef.value) {
    carouselWidth.value = carouselRef.value.offsetWidth;
  }
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  if (carouselRef.value) {
    carouselWidth.value = carouselRef.value.offsetWidth;
  }
};

function getStartOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Mini-Strip -->
    <div
      class="flex gap-0.5 overflow-x-auto p-1.5 scrollbar-thin"
    >
      <div
        v-for="(day, i) in weekDays"
        :key="day.dayIndex"
        class="flex min-w-0 flex-1 cursor-pointer flex-col items-center rounded p-1 transition-colors"
        :class="{
          'bg-sonja-bg-darker': i === activeDayIndex,
        }"
        @click="goToDay(i)"
      >
        <div
          class="text-xs font-bold"
          :class="{ 'text-sonja-akz': i === activeDayIndex }"
        >
          {{ day.label }}
          <span class="font-normal text-sonja-text/40">{{ day.date.getDate() }}.</span>
        </div>
        <div
          v-for="p in day.plans.slice(0, 2)"
          :key="p.id"
          class="w-full truncate text-center text-[9px] leading-tight text-sonja-text/60"
        >
          {{ p.name }}
        </div>
        <div
          v-if="day.plans.length > 2"
          class="text-[9px] text-sonja-text/40"
        >
          +{{ day.plans.length - 2 }}
        </div>
      </div>
    </div>

    <!-- Carousel -->
    <div
      ref="carouselRef"
      class="flex flex-1 overflow-hidden border-t border-sonja-bg-darker"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <div
        class="flex h-full transition-transform duration-300 ease-in-out"
        :style="{
          transform: `translateX(${-activeDayIndex * carouselWidth}px)`,
        }"
      >
        <div
          v-for="(day, i) in weekDays"
          :key="day.dayIndex"
          class="flex h-full flex-shrink-0 flex-col items-center gap-3 p-4"
          :style="{ width: carouselWidth + 'px' }"
        >
          <div class="flex w-full items-center justify-between">
            <button
              @click="prevDay"
              :disabled="i === 0"
              class="flex h-10 w-10 items-center justify-center rounded-full text-sonja-text/60 disabled:opacity-20"
            >
              <i class="fa-solid fa-chevron-left" />
            </button>

            <div class="text-3xl font-bold">
              {{ fullDayLabels[i] }}
            </div>

            <button
              @click="nextDay"
              :disabled="i === 6"
              class="flex h-10 w-10 items-center justify-center rounded-full text-sonja-text/60 disabled:opacity-20"
            >
              <i class="fa-solid fa-chevron-right" />
            </button>
          </div>

          <div
            v-if="day.plans.length > 0"
            class="flex w-full flex-col gap-2"
          >
            <div
              v-for="p in day.plans"
              :key="p.id"
              class="relative w-full overflow-hidden rounded-lg"
            >
              <div
                class="absolute inset-0 flex items-center justify-end rounded-lg bg-red-800 px-4"
              >
                <i class="fa-solid fa-trash text-white" />
              </div>
              <div
                class="relative w-full cursor-pointer rounded-lg bg-sonja-akz px-4 py-3 text-center text-lg font-bold text-white transition-[transform] duration-200 ease-out"
                :style="{
                  transform: `translateX(${swipeOffsets[p.id] ?? 0}px)`,
                }"
                @click="emit('selectPlan', p)"
                @touchstart.passive="cardTouchStart($event, p.id)"
                @touchmove.passive="cardTouchMove($event, p.id)"
                @touchend.passive="cardTouchEnd($event, p.id, day.dayIndex)"
              >
                {{ p.name }}
              </div>
            </div>
          </div>

          <div
            v-else
            class="flex flex-1 items-center justify-center text-sonja-text/30"
          >
            No plans
          </div>

          <button
            class="flex h-12 w-12 items-center justify-center rounded-full bg-sonja-bg-darker text-lg"
            @click.stop="openAssign(day.dayIndex)"
          >
            <i class="fa-solid fa-plus" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-center gap-1.5 py-2">
      <div
        v-for="(_, i) in weekDays"
        :key="i"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="
          i === activeDayIndex
            ? 'w-4 bg-sonja-akz'
            : 'w-1.5 bg-sonja-bg-darker'
        "
      />
    </div>

    <DialogsDialog
      :is-open="showAssignDialog"
      w="22rem"
      @close="showAssignDialog = false"
    >
      <div class="flex flex-col gap-2">
        <div class="mb-2 text-center text-lg font-bold">
          {{
            selectedDayIndex
              ? ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][
                  selectedDayIndex - 1
                ]
              : ""
          }}
        </div>
        <div
          v-for="p in allUserPlans"
          :key="p.id"
          class="flex cursor-pointer items-center justify-between rounded bg-sonja-bg-darker px-3 py-2"
          @click="
            toggleDayPlan(p.id, selectedDayIndex!, !!p.days?.includes(selectedDayIndex!))
          "
        >
          <span>{{ p.name }}</span>
          <span v-if="p.days?.includes(selectedDayIndex!)">
            <i class="fa-solid fa-check text-sonja-akz" />
          </span>
        </div>
      </div>
    </DialogsDialog>
  </div>
</template>
