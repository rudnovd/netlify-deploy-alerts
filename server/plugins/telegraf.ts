import { createClient } from '@supabase/supabase-js'

export default defineNitroPlugin(() => {
  const telegraf = useTelegraf()
  const {
    supabase: { url, key },
  } = useRuntimeConfig().public
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  telegraf.command('start', async (ctx) => {
    const userId = ctx.message.from.id
    const username = `@${ctx.message.from.username}`

    const { data: target } = await supabase
      .from('targets')
      .select('confirmed, meta')
      .eq('provider', 'Telegram')
      .eq('target', username)
      .single()

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
