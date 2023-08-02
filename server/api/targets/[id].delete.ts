import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)
  const { id } = event.context.params ?? {}

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusMessage: 'Target id parameter required' })
  }

  const { error: targetDeleteError } = await supabase.from('targets').delete().eq('user', user.id).eq('id', id)

  if (targetDeleteError) {
    throw createError(targetDeleteError.message)
  }

  return true
})
