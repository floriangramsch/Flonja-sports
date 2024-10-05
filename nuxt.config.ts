// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  plugins: ["~/plugins/vue-query"],
  app: {
    head: {
      title: "Flonja Sports",
      meta: [
        { name: "theme-color", content: "#D5BDAF" },
        { name: "description", content: "Planer für Fiona" },
      ],
      script: [
        {
          src: "https://kit.fontawesome.com/1b387810f3.js",
          crossorigin: "anonymous",
        },
      ],
    },
  },
});
