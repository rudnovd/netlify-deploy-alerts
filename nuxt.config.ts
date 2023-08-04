// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxthq/ui', '@nuxtjs/supabase', '@nuxtjs/eslint-module', '@vueuse/nuxt'],
  typescript: {
    strict: true,
  },
  nitro: {
    plugins: ['plugins/telegraf.ts'],
  },
  runtimeConfig: {
    public: {
      telegramBotLink: process.env.NUXT_TELEGRAM_BOT_LINK,
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Netlify Deploy Alerts',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'application-name',
          content: 'Netlify Deploy Alerts',
        },
        {
          name: 'description',
          content: 'Get notifications when your Netlify projects are deployed',
        },
        {
          name: 'keywords',
          content: 'netlify, deploy, alerts, telegram',
        },
      ],
    },
  },
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
    },
  },
})
