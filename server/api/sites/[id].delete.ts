import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const { id } = event.context.params ?? {}

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusMessage: 'Site id parameter required' })
  }

  const { error: alertsDeleteError } = await supabase.from('alerts').delete().eq('user', user.id).eq('site', id)
  if (alertsDeleteError) {
    throw createError(alertsDeleteError.message)
  }

  const { error: siteDeleteError } = await supabase.from('sites').delete().eq('user', user.id).eq('id', id)
  if (siteDeleteError) {
    throw createError(siteDeleteError.message)
  }

  return true
})
