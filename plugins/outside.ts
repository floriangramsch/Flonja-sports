import { defineNuxtPlugin } from "#app";
import type { DirectiveBinding } from "vue";

declare global {
  interface HTMLElement {
    _handleClickOutside?: (event: Event) => void;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  nuxtApp.vueApp.directive("outside", {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
      if (typeof binding.value !== "function") {
        console.warn("v-outside benötigt eine Funktion als Wert.");
        return;
      }

      const handleClickOutside = (event: Event) => {
        if (el && !el.contains(event.target as Node)) {
          binding.value(event); // Callback auslösen
        }
      };

      el._handleClickOutside = handleClickOutside;

      document.addEventListener("click", handleClickOutside, true);
    },
    unmounted(el: HTMLElement) {
      if (el._handleClickOutside) {
        document.removeEventListener("click", el._handleClickOutside);
        el._handleClickOutside = undefined;
      }
    },
  });
});
