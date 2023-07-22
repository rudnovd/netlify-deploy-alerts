import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const { site } = getQuery(event)

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  }

  const request = supabase
    .from('alerts')
    .select('id, event, target, text, enabled, site, created_at, updated_at')
    .eq('user', user.id)
    .order('created_at', { ascending: false })
    .order('updated_at', { ascending: false })

  if (site) {
    request.eq('site', site)
  }

  const { data, error } = await request

  if (error) {
    throw createError(error.message)
  }

  return data
})
