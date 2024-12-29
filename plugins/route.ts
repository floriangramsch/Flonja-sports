import type { DirectiveBinding } from "vue";

export default defineNuxtPlugin((app) => {
  const routerStore = useRouterStore();

  app.vueApp.directive("route", {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      updateDisplay(el, binding.value); // Initialanzeige
      watchRoute(el, binding.value);
    },

    // updated(el: HTMLElement, binding: DirectiveBinding) {
    //   updateDisplay(el, binding.value);
    // },
  });

  const updateDisplay = (el: HTMLElement, route: string) => {
    el.style.display = routerStore.route !== route ? "none" : "";
    // console.log(`Route check: ${routerStore.route} === ${route}`);
  };

  const watchRoute = (el: HTMLElement, route: string) => {
    watchEffect(() => {
      updateDisplay(el, route);
    });
  };
});
