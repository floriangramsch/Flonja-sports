// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  plugins: ["~/plugins/vue-query"],
  css: ["~/assets/global.css"],
  app: {
    head: {
      title: "Flonja Sports",
      meta: [
        // { name: "theme-color", content: "#97918e" },
        { name: "msapplication-TileColor", content: "#da532c" },
        { name: "description", content: "Fitness App für Jeden." },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
        { name: "apple-mobile-web-app-title", content: "Flonja Sports" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
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
