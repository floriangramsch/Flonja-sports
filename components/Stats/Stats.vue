<script setup lang="ts">
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import Label from "../ui/label/Label.vue";

const props = defineProps<{
  logged: LoggedType;
  workout?: WorkoutType;
}>();

const showList = ref<boolean>(false);

const { data: stats } = useGetStats();
const updateMutation = useUpdateStats();
const deleteMutation = useDeleteStats();
const addMutation = useAddStats();

const statToDelete = ref<number>();
const showConfirmDeleteStat = ref<boolean>(false);
const deleteStat = () => {
  if (statToDelete.value) {
    deleteMutation.mutate(statToDelete.value, {
      onSuccess: () => (showConfirmDeleteStat.value = false),
    });
  }
};

const showNewStat = ref<boolean>(false);
const newWeight = ref<number>();
const newStat = () => {
  if (props.logged.user?.id && newWeight.value) {
    addMutation.mutate(
      {
        user_id: props.logged.user?.id,
        weight: newWeight.value,
      },
      {
        onSuccess: () => {
          showNewStat.value = false;
          newWeight.value = undefined;
        },
      },
    );
  }
};

const show = (time: any) => {
  if (!time) return "?";
  const convertedTime = new Date(time);
  const year = convertedTime.getUTCFullYear().toString().slice(-2);
  const month = convertedTime.getMonth() + 1;
  const day = convertedTime.getDate();
  const hours = convertedTime.getHours();
  const minutes = convertedTime.getMinutes();
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const newLocker = ref<number | undefined>(props.workout?.locker);
const updateLockerMutation = useUpdateWorkout();

const updateWorkout = () => {
  if (
    props.workout?.workout_id &&
    newLocker.value &&
    props.workout.locker !== newLocker.value
  ) {
    updateLockerMutation.mutate({
      updatedData: `locker = ${newLocker.value}`,
      workout_id: props.workout?.workout_id,
    });
  }
};
watch(
  () => props.workout?.locker,
  (newVal) => {
    if (newVal) {
      newLocker.value = newVal;
    } else {
      newLocker.value = undefined;
    }
  },
);
</script>
<template>
  <div>
    <!-- Header -->
    <div class="flex w-full justify-evenly px-2 py-4">
      <i
        class="fa-solid fa-list absolute left-4 pl-2 text-3xl"
        @click="showList = !showList"
      />
      <div class="text-center text-4xl font-bold">Stats</div>
    </div>
    <!-- Stats -->
    <div v-if="workout" class="mb-2 flex w-full flex-col items-center gap-3">
      <!-- <div>Locker: {{ workout?.locker }}</div> -->
      <div>
        <UiNumberInput
          v-model:modelValue="newLocker"
          label="Lockernummer"
          @action="updateWorkout"
        />
      </div>
      <Label
        :value="show(workout?.start) + '-' + show(workout?.end).slice(-5)"
        label="Time"
      />
      <!-- <Label :value="show(workout?.end)" label="End" /> -->
    </div>
    <ChartsBasicChart
      v-if="stats"
      :dataFlorian="
        stats.Florian.map((stat: StatsType) => [stat.date, stat.body_weight])
      "
      :dataSonja="
        stats.Sonja.map((stat: StatsType) => [stat.date, stat.body_weight])
      "
    />

    <Dialog :isOpen="showNewStat" @close="showNewStat = false">
      <template v-slot:trigger>
        <div class="flex w-full justify-center">
          <UiButtonsButton class="px-10" @action="showNewStat = true">
            New
          </UiButtonsButton>
        </div>
      </template>
      <!-- <UiInputsTextinput v-model="newWeight" label="Weight" /> -->
      <UiNumberInput class="mb-2" v-model="newWeight" label="Weight" />
      <Button @action="newStat">New</Button>
    </Dialog>

    <div
      v-show="showList"
      class="opacity-0 transition-opacity duration-500 ease-in-out"
      :class="{ 'opacity-100': showList }"
    >
      Flo
      <div v-for="stat in stats?.Florian">
        {{ showTime(stat.date) }}: {{ stat.body_weight }} kg
        <button
          class="ml-2"
          @click.stop="
            statToDelete = Number(stat.stats_id);
            showConfirmDeleteStat = true;
          "
        >
          <i class="fa-solid fa-close text-red-800" />
        </button>
      </div>
      Sonja
      <div v-for="stat in stats?.Sonja">
        {{ showTime(stat.date) }}: {{ stat.body_weight }} kg
        <button
          class="ml-2"
          @click.stop="
            statToDelete = Number(stat.stats_id);
            showConfirmDeleteStat = true;
          "
        >
          <i class="fa-solid fa-close text-red-800" />
        </button>
      </div>
    </div>
    <Confirm v-model:isOpen="showConfirmDeleteStat" @yes="deleteStat()" />
  </div>
</template>
