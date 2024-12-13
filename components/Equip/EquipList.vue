<script setup lang="ts">
import { computed, ref } from "vue";
import FilterEquips from "../Filter/FilterEquips.vue";
import Filter from "../Filter/Filter.vue";
import Confirm from "../Dialogs/Confirm.vue";
import { useEquipStats } from "~/composables/useEquips";
import NewEquip from "../Dialogs/NewEquip.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import Select from "../ui/select/Select.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import FilterWrapper from "../Filter/FilterWrapper.vue";

defineProps<{
  muscles: MuscleType[];
  users: UserType;
  workout: WorkoutType | undefined;
}>();

const filter = ref<number[]>([]);
const exerciceFilter = defineModel<number[]>("filter");
const show = defineModel<ShowType>("show");
const showDialogMuscle = ref<boolean>(false);
const showDialogEquip = ref<boolean>(false);
const showDialogUpdateEquip = ref<boolean>(false);
const searchFilter = ref<string>("");

const deleteEquipMutation = useDeleteEquip();
const showConfirmDeleteEquip = ref<boolean>(false);

const equipForm = ref<{
  equip_name?: string;
  equip_id?: number;
  muscle_id?: number;
  info?: string;
  type?: EquipArtType;
  metric?: EquipMetricType;
}>({
  equip_name: undefined,
  equip_id: undefined,
  muscle_id: undefined,
  info: undefined,
  type: undefined,
  metric: undefined,
});
const updateEquipMutation = useUpdateEquip();
const updateEquip = () => {
  if (equipForm.value && equipForm.value.equip_id) {
    updateEquipMutation.mutate(
      {
        updatedData: `name = '${equipForm.value.equip_name}', muscle_group_id = '${equipForm.value.muscle_id}', info = '${equipForm.value.info}', type = '${equipForm.value.type}', metric = '${equipForm.value.metric}'`,
        equip_id: equipForm.value.equip_id,
      },
      {
        onSuccess: () => {
          showDialogUpdateEquip.value = false;
          equipForm.value = {
            equip_name: undefined,
            equip_id: undefined,
            muscle_id: undefined,
            info: undefined,
            type: undefined,
            metric: undefined,
          };
        },
      },
    );
  }
};

const equipToDelete = ref<number>();
const deleteEquip = (id: number) => {
  deleteEquipMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteEquip.value = false),
  });
};

const { data: equipStats } = useEquipStats();

const filteredEquips = computed(() => {
  return equipStats.value?.filter((equip) => {
    const matchesMuscleFilter =
      filter.value.length === 0 || filter.value.includes(equip.muscle_id);

    const matchesSearchFilter =
      searchFilter.value === "" ||
      equip.equip_name
        .toLowerCase()
        .includes(searchFilter.value.toLowerCase()) ||
      equip.muscle_name
        .toLowerCase()
        .includes(searchFilter.value.toLowerCase());

    return matchesMuscleFilter && matchesSearchFilter;
  });
});

const equipList = computed<EquipStatsType[][] | undefined>(() => {
  if (filteredEquips.value) {
    const groupedData = filteredEquips.value?.reduce(
      (acc: { [key: number]: any[] }, curr) => {
        const equipId = curr.equip_id;
        const userId = curr.user_id;

        // Wenn das equip_id noch nicht existiert, füge es hinzu
        if (!acc[equipId]) {
          acc[equipId] = [];
        }

        // Prüfen, ob das erste Objekt bereits für dieses equip_id existiert
        const firstEntry = acc[equipId][0];

        if (!firstEntry) {
          acc[equipId].push({
            equip_name: curr.equip_name,
            equip_id: curr.equip_id,
            muscle_name: curr.muscle_name,
            muscle_id: curr.muscle_id,
            info: curr.info,
            type: curr.type,
            metric: curr.metric,
          });
        }

        acc[equipId].push({
          user_id: userId,
          max_weight: curr.max_weight,
          last_weight: curr.last_weight,
          user_name: curr.user_name,
        });

        return acc;
      },
      {},
    );

    // Umwandeln der Ergebnisse in ein Array von Arrays und nach Namen sortieren
    return Object.values(groupedData).sort((a, b) => {
      // TODO: variable sorting
      return a[0].equip_name.localeCompare(b[0].equip_name);
    });
  }
});

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;

const filterWrapperComponent = ref<InstanceType<typeof Filter> | null>(null);
</script>

<template>
  <div class="relativ">
    <!-- Header -->
    <div class="flex w-full justify-evenly px-2 py-4">
      <button
        v-if="show"
        class="absolute left-6 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="show.showRouter = 'musclelist'"
      >
        <i class="fa-solid fa-repeat" />
      </button>
      <div class="text-center text-4xl font-bold">Equip List</div>
      <button
        class="absolute right-6 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="filterWrapperComponent?.toggle"
      >
        <i class="fa-solid fa-filter" />
      </button>
    </div>

    <FilterWrapper ref="filterWrapperComponent">
      <Filter
        :data="
          muscles.map((muscle: MuscleType) => ({
            id: muscle.muscle_group_id,
            name: muscle.muscle_name,
          }))
        "
        v-model="filter"
      />
      <FilterEquips v-model="searchFilter" />
      <!-- New Equip -->
      <Dialog
        :isOpen="showDialogEquip"
        @close="
          showDialogEquip = false;
          showDialogMuscle = false;
        "
      >
        <template #trigger>
          <button
            class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
            @click="showDialogEquip = true"
          >
            <i class="fa-solid fa-plus" />
          </button>
        </template>
        <NewEquip
          @close="
            showDialogEquip = false;
            showDialogMuscle = false;
          "
        />
      </Dialog>
    </FilterWrapper>
    <!-- Update Equip -->
    <Dialog
      :isOpen="showDialogUpdateEquip"
      @close="
        showDialogEquip = false;
        showDialogMuscle = false;
        showDialogUpdateEquip = false;
      "
    >
      <div class="my-2 flex flex-col gap-4">
        <Textinput v-model="equipForm.equip_name" label="Equip Name" focus />

        <Select
          class="w-full"
          v-model="equipForm.muscle_id"
          default="Muskle..."
          :options="
            muscles.map((muscle) => ({
              label: muscle.muscle_name,
              value: muscle.muscle_group_id,
            }))
          "
        />

        <Select
          class="w-full"
          v-model="equipForm.type"
          default="Type..."
          :options="[
            { value: 'Bodyweight', label: 'Bodyweight' },
            { value: 'Machine', label: 'Machine' },
            { value: 'Dumbbell', label: 'Dumbbell' },
          ]"
        />

        <Select
          class="w-full"
          v-model="equipForm.metric"
          default="Metric..."
          :options="[
            { value: 'Time', label: 'Time' },
            { value: 'Weight', label: 'Weight' },
          ]"
        />

        <!-- Info -->
        <div class="relative">
          <textarea
            class="peer h-48 w-48 rounded border-2 border-sonja-text bg-sonja-text p-2 text-sonja-akz2 shadow focus:outline-none focus:ring-2 focus:ring-sonja-akz"
            v-model="equipForm.info"
            ref="infoRef"
            placeholder=" "
          />
          <label
            :for="labelId"
            class="absolute left-2 -translate-y-1/2 rounded bg-sonja-akz p-[2px] text-xs text-sonja-text shadow transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-xl peer-placeholder-shown:text-sonja-akz2 peer-focus:left-2 peer-focus:top-0 peer-focus:bg-sonja-akz peer-focus:p-[2px] peer-focus:text-xs peer-focus:text-sonja-text"
          >
            Info
          </label>
        </div>
      </div>
      <Button @action="updateEquip">Update</Button>
    </Dialog>
    <!-- Equip List -->
    <div
      class="no-scrollbar flex snap-y snap-mandatory flex-col overflow-y-scroll bg-sonja-bg"
    >
      <div v-for="equip in equipList" class="p-1">
        <div
          @click="
            {
              equipForm = {
                equip_name: equip[0].equip_name,
                equip_id: equip[0].equip_id,
                muscle_id: equip[0].muscle_id,
                info: equip[0].info,
                type: equip[0].type,
                metric: equip[0].metric,
              };
              showDialogUpdateEquip = true;
            }
          "
          class="flex cursor-pointer gap-1 overflow-x-scroll whitespace-nowrap text-2xl font-bold sm:overflow-x-auto"
        >
          {{ equip[0].equip_name }} [{{ equip[0].muscle_name }}]
          <i v-if="equip[0].type === 'Machine'" class="fa-solid fa-laptop" />
          <i
            v-else-if="equip[0].type === 'Bodyweight'"
            class="fa-solid fa-child-reaching"
          />
          <i
            v-else-if="equip[0].type === 'Dumbbell'"
            class="fa-solid fa-dumbbell"
          />
          <i v-if="equip[0].metric === 'Time'" class="fa-solid fa-clock" />
          <i
            v-else-if="equip[0].metric === 'Weight'"
            class="fa-solid fa-weight-hanging"
          />
          <button
            class="ml-2"
            @click.stop="
              exerciceFilter?.push(equip[0].equip_id);
              if (show) show.showRouter = 'exercises';
            "
          >
            <i class="fa-solid fa-chart-line text-sonja-akz" />
          </button>
          <!-- Delete Equip -->
          <button
            class="ml-2"
            @click.stop="
              equipToDelete = Number(equip[0].equip_id);
              showConfirmDeleteEquip = true;
            "
          >
            <i class="fa-solid fa-close text-red-800" />
          </button>
        </div>
        <div v-for="user in equip.slice(1)" class="flex gap-2">
          <div v-if="user.user_name" class="flex gap-2">
            <div v-if="user.user_name">{{ user.user_name }}:</div>
            <div v-if="user.max_weight">PB {{ user.max_weight }}</div>
            <div v-else="user.max_weight">PB TBD</div>
            <div v-if="user.last_weight">Last {{ user.last_weight }}</div>
            <div v-else="user.last_weight">Last TBD</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Confirm Delete Equip -->
    <Confirm
      v-model:isOpen="showConfirmDeleteEquip"
      @yes="deleteEquip(Number(equipToDelete))"
    />
  </div>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>
