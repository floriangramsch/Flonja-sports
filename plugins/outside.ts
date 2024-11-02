// @ts-ignore
export default defineNuxtPlugin((app: NuxtApp) => {
  app.vueApp.directive("outside", {
    // @ts-ignore
    mounted(el) {
      console.log("mounted", el);
    },
  });
});
