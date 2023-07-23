import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  }

  const { data, error } = await supabase
    .from('targets')
    .select('id, provider, target, confirmed, created_at')
    .eq('user', user.id)

  if (error) {
    throw createError(error.message)
  }

  return data
})
