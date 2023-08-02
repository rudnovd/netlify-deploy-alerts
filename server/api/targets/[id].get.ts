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

  const { data: target, error: targetError } = await supabase
    .from('targets')
    .select('id, provider, target, confirmed, created_at')
    .eq('user', user.id)
    .eq('id', id)
    .single()

  if (targetError) {
    throw createError(targetError.message)
  }

  return target
})
