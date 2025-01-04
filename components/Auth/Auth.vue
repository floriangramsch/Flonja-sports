<script setup lang="ts">
import Dialog from "../Dialogs/Dialog.vue";
import Login from "./Login.vue";
import Register from "./Register.vue";

const loggedStore = useLoggedStore();

const isOpen = ref<boolean>(false);
const isLogin = ref<boolean>(false);
const openLogin = () => {
  isLogin.value = true;
  isOpen.value = true;
};
const openRegister = () => {
  isLogin.value = false;
  isOpen.value = true;
};
const close = () => (isOpen.value = false);

defineExpose({ openLogin, openRegister });
</script>

<template>
  <Dialog :isOpen @close="close">
    <Login v-if="isLogin" @close="close" />
    <Register v-else @close="close" />
  </Dialog>
</template>
