// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: true,
  dev: true,
  sourcemap: {
    client: true,
    server: true,
  },
  modules: ['@nuxthq/ui', '@nuxtjs/supabase', '@nuxtjs/eslint-module', '@vueuse/nuxt'],
  typescript: {
    strict: true,
  },
  build: {
    // extend(config, ctx) {
    //   if (ctx.isDev) {
    //     config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
    //   }
    // }
    analyze: true,
  },
  nitro: {
    plugins: ['plugins/telegraf.ts'],
  },
  runtimeConfig: {
    public: {
      telegramBotLink: process.env.NUXT_TELEGRAM_BOT_LINK,
      title: 'Netlify Deploy Alerts',
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
})
