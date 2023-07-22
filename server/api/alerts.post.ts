import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const {
    target,
    event: alertEvent,
    text,
    site,
  } = await readBody<Readonly<Pick<Alert, 'target' | 'event' | 'text' | 'site'>>>(event)

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  }

  if (!alertEvent) {
    throw createError({ statusMessage: 'Event is required' })
  } else if (!text) {
    throw createError({ statusMessage: 'Text is required' })
  } else if (!target) {
    throw createError({ statusMessage: 'Target is required' })
  } else if (!site) {
    throw createError({ statusMessage: 'Site is required' })
  }

  const { data, error } = await supabase
    .from('alerts')
    .insert({
      event: alertEvent,
      target,
      user: user.id,
      text,
      site,
    })
    .select('id, event, target, text, site, enabled, created_at, updated_at')
    .single()

  if (error) {
    throw createError(error.message)
  }

  return data
})
