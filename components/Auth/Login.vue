<script setup lang="ts">
const emit = defineEmits<{
  (e: "close"): void;
}>();

const form = ref<{ name?: string; password?: string }>({
  name: undefined,
  password: undefined,
});

const loginMutation = useLogin();
const login = () => {
  if (form.value.name && form.value.password) {
    loginMutation.mutate(
      {
        username: form.value.name,
        password: form.value.password,
      },
      {
        onSuccess: () => {
          emit("close");
          form.value = {
            name: undefined,
            password: undefined,
          };
        },
      },
    );
  }
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="text-3xl">Login</div>
    <UiInputsTextinput label="Name" v-model="form.name" focus />
    <UiInputsTextinput
      label="Password"
      type="password"
      v-model="form.password"
    />
    <UiButtonsButton @action="login">Login</UiButtonsButton>
  </div>
</template>
