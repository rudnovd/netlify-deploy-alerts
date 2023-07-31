import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (h3Event) => {
  const user = await serverSupabaseUser(h3Event)
  const supabase = serverSupabaseClient<Database>(h3Event)
  const { event, target, text, enabled } = await readBody<Readonly<Partial<Alert>>>(h3Event)
  const { id } = h3Event.context.params ?? {}

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusMessage: 'Alert id parameter required' })
  }

  const { data: updatedAlert, error: updateAlertError } = await supabase
    .from('alerts')
    .update({
      event,
      target,
      text,
      enabled,
    })
    .eq('user', user.id)
    .eq('id', id)
    .select()
    .single()

  if (updateAlertError) {
    throw createError(updateAlertError.message)
  }

  return updatedAlert
})
