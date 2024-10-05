// plugins/vue-query.js
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient();

  // Verwende das VueQueryPlugin
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });
});
