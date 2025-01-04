<script setup lang="ts">
import Auth from './Auth/Auth.vue';

const loggedStore = useLoggedStore()
const routeStore = useRouterStore()

const mutation = useAddWorkout();

const addWorkout = () => {
  if (loggedStore.logged.user?.id) {
    mutation.mutate(loggedStore.logged.user?.id, {
      onSuccess: ({ workoutId }) => {
        if (loggedStore.logged) {
          loggedStore.logged.isLogged = true;
          loggedStore.logged.loggedWorkoutId = workoutId;
          loggedStore.toStorage()
          routeStore.setWorkoutRoute('workoutdetail')
        }
      },
    });
  } else {
    authRef.value?.openRegister()
  }
};

const authRef = ref<InstanceType<typeof Auth> | null>(null);
</script>

<template>
  <div class="flex h-full items-center justify-center bg-sonja-bg">
    <button
      class="flex h-12 items-center rounded-3xl bg-sonja-text px-20 text-sonja-akz3 shadow"
      @click.prevent="addWorkout"
    >
      Start
    </button>
    <Auth ref="authRef" />
  </div>
</template>
