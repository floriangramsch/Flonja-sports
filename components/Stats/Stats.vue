<script setup lang="ts">
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import Label from "../ui/label/Label.vue";

const props = defineProps<{
  workout?: WorkoutType;
}>();

const showList = ref<boolean>(false);

const loggedStore = useLoggedStore();
const routerStore = useRouterStore();

const { data: body_weight_stats } = useGetUserStats(
  computed(() => loggedStore.logged.user),
  "body_weight",
);
const { data: bauchumfang_stats } = useGetUserStats(
  computed(() => loggedStore.logged.user),
  "bauchumfang",
);
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
const statForm = ref<NewStatsType>({
  body_weight: undefined,
  bauchumfang: undefined,
});
const newStat = () => {
  Object.keys(statForm.value).forEach((key) => {
    // @ts-ignore
    if (statForm.value[key] === "") {
      // @ts-ignore

      statForm.value[key] = undefined;
    }
  });
  if (
    loggedStore.logged.user?.id &&
    statForm.value &&
    Object.values(statForm.value).some((v) => v !== undefined)
  ) {
    addMutation.mutate(
      {
        user_id: loggedStore.logged.user?.id,
        form: statForm.value,
      },
      {
        onSuccess: () => {
          showNewStat.value = false;
          statForm.value.body_weight = undefined;
          statForm.value.bauchumfang = undefined;
        },
      },
    );
  }
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
    <Header
      @left="showList = !showList"
      @right="routerStore.route = 'workouts'"
      leftIcon="fa-solid fa-barcode"
      rightIcon="fa-solid fa-calendar"
    >
      Stats
    </Header>
    <FileUpload v-if="loggedStore.logged.user.name" />
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
        :value="showTime(workout?.start) + '-' + showTime(workout?.end).slice(-5)"
        label="Time"
      />
      <!-- <Label :value="show(workout?.end)" label="End" /> -->
    </div>
    <!-- Weight -->
    <ChartsBasicChart
      v-if="
        body_weight_stats &&
        (loggedStore.logged.user.name === 'Florian' ||
          loggedStore.logged.user.name === 'Sonja')
      "
      :dataFlorian="
        body_weight_stats.Florian.map((stat: StatsType) => [
          stat.date,
          stat.body_weight,
        ])
      "
      :dataSonja="
        body_weight_stats.Sonja.map((stat: StatsType) => [
          stat.date,
          stat.body_weight,
        ])
      "
      title="Weight"
    />
    <ChartsBasicChart
      v-else-if="
        body_weight_stats &&
        loggedStore.logged.user.name &&
        body_weight_stats[loggedStore.logged.user.name]
      "
      :dataFlorian="
        body_weight_stats[loggedStore.logged.user.name].map(
          (stat: StatsType) => [stat.date, stat.body_weight],
        )
      "
      title="Weight"
    />

    <!-- Bauchumfang -->
    <ChartsBasicChart
      v-if="
        bauchumfang_stats &&
        (loggedStore.logged.user.name === 'Florian' ||
          loggedStore.logged.user.name === 'Sonja')
      "
      :dataFlorian="
        bauchumfang_stats.Florian.map((stat: StatsType) => [
          stat.date,
          stat.bauchumfang,
        ])
      "
      :dataSonja="
        bauchumfang_stats.Sonja.map((stat: StatsType) => [
          stat.date,
          stat.bauchumfang,
        ])
      "
      title="Bauchumfang"
    />
    <ChartsBasicChart
      v-else-if="
        bauchumfang_stats &&
        loggedStore.logged.user.name &&
        bauchumfang_stats[loggedStore.logged.user.name]
      "
      :dataFlorian="
        bauchumfang_stats[loggedStore.logged.user.name].map(
          (stat: StatsType) => [stat.date, stat.bauchumfang],
        )
      "
      title="Bauchumfang"
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
      <UiNumberInput
        class="mb-2"
        v-model="statForm.body_weight"
        label="Weight"
        focus
      />
      <UiNumberInput
        class="mb-2"
        v-model="statForm.bauchumfang"
        label="Bauchumfang"
      />
      <Button @action="newStat">New</Button>
    </Dialog>

    <div
      v-show="showList"
      class="opacity-0 transition-opacity duration-500 ease-in-out"
      :class="{ 'opacity-100': showList }"
    >
      Flo (Bodyweight)
      <div v-for="stat in body_weight_stats?.Florian">
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
      Flo (Bauchumfang)
      <div v-for="stat in bauchumfang_stats?.Florian">
        {{ showTime(stat.date) }}: {{ stat.bauchumfang }} cm
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
      Sonja (Bodyweight)
      <div v-for="stat in body_weight_stats?.Sonja">
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
      Sonja (Bauchumfang)
      <div v-for="stat in bauchumfang_stats?.Sonja">
        {{ showTime(stat.date) }}: {{ stat.bauchumfang }} cm
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
