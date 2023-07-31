import { createClient } from '@supabase/supabase-js'

export default defineNitroPlugin(() => {
  const telegraf = useTelegraf()
  const {
    supabase: { url, key },
  } = useRuntimeConfig().public
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  telegraf.command('start', (ctx) => {
    ctx.reply(`
      Welcome to our Netlify Deployment Alert Bot! 🤖

      We're here to keep you updated on the status of your projects deployed to Netlify. Whenever a deployment occurs, we'll send you real-time alerts so you can stay informed and track the progress of your deployments effortlessly.
      
      To get started, please visit https://netlifydeployalerts.netlify.app.
    `)
  })

  telegraf.command('confirm', async (ctx) => {
    const userId = ctx.message.from.id
    const username = `@${ctx.message.from.username}`

    const { data: target, error: targetError } = await supabase
      .from('targets')
      .select('confirmed, meta')
      .eq('provider', 'Telegram')
      .eq('target', username)
      .single()

    if (targetError) {
      throw createError(targetError.message)
    } else if (!target) {
      return ctx.reply('Target not created, first create target at https://netlifydeployalerts.netlify.app/targets/add')
    }

    if (!target?.confirmed || !target.meta) {
      await supabase
        .from('targets')
        .update({
          confirmed: true,
          meta: userId,
        })
        .eq('provider', 'Telegram')
        .eq('target', username)

      ctx.reply('Confirmed 👍')
    } else {
      ctx.reply('Already confirmed 👍')
    }
  })
})
