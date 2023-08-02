import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  }

  const { data: sites, error: sitesError } = await supabase.from('sites').select('id, url, enabled').eq('user', user.id)

  if (sitesError) {
    throw createError(sitesError.message)
  }

  return sites
})
