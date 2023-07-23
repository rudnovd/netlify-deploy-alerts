// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxthq/ui', '@nuxtjs/supabase', '@nuxtjs/eslint-module'],
  typescript: {
    strict: true,
  },
  nitro: {
    plugins: ['plugins/telegraf.ts'],
  },
})