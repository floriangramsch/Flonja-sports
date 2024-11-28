<script setup lang="ts">
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";

const props = defineProps<{
  logged: LoggedType;
}>();

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
      }
    );
  }
};
</script>
<template>
  <div>
    <!-- Header -->
    <div class="w-full flex justify-evenly py-4 px-2">
      <div class="text-4xl font-bold text-center">Stats</div>
    </div>
    <!-- Stats -->
    <div v-for="stat in stats" class="p-2">
      <div>{{ stat.name }}: {{ new Date(stat.date).toLocaleString() }}</div>
      <div>
        {{ stat.body_weight }} kg
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
    <Dialog :isOpen="showNewStat" @close="showNewStat = false">
      <template v-slot:trigger>
        <div class="flex justify-center w-full">
          <UiButtonsButton class="px-10" @action="showNewStat = true">
            New
          </UiButtonsButton>
        </div>
      </template>
      <!-- <UiInputsTextinput v-model="newWeight" label="Weight" /> -->
      <UiNumberInput class="mb-2" v-model="newWeight" label="Weight" />
      <Button @action="newStat">New</Button>
    </Dialog>
  </div>
</template>
