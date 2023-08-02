import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  }

  const { data: events, error: eventsError } = await supabase.from('events').select('id, name')

  if (eventsError) {
    throw createError(eventsError.message)
  }

  return events
})
