import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const { event: alertEvent, target, text, enabled } = await readBody<Readonly<Partial<Alert>>>(event)
  const { id } = event.context.params || {}

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusMessage: 'Alert id parameter required' })
  }

  const { data, error } = await supabase
    .from('alerts')
    .update({
      event: alertEvent,
      target,
      text,
      enabled,
    })
    .eq('user', user.id)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError(error.message)
  }

  return data
})
