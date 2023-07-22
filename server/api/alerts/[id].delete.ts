import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const { id } = event.context.params || {}

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusMessage: 'Target id parameter required' })
  }

  const { error } = await supabase.from('alerts').delete().eq('user', user.id).eq('id', id)

  if (error) {
    throw createError(error.message)
  }

  return true
})
