import { Telegraf } from 'telegraf'
import { Database } from '../../../types/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseClient<Database>(event)
  const { id } = event.context.params || {}

  if (!id) {
    throw createError({ statusMessage: 'Alert id parameter required' })
  }

  const { data: alert, error } = await supabase.from('alerts').select('*').eq('id', id).single()

  if (error) {
    throw createError(error.message)
  }

  const { data: target, error: targetError } = await supabase
    .from('targets')
    .select('provider, target')
    .eq('id', alert.target)
    .single()

  if (targetError) {
    throw createError(targetError.message)
  }

  const bot = new Telegraf(process.env.BOT_TOKEN || '')
  await bot.launch()
  bot.telegram.sendMessage(target.target, alert.text)
  bot.stop()

  // console.log('New request: ', event.context.telegraf)

  return alert
})
