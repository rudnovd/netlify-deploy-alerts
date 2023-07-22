import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const { provider, target } = await readBody<Readonly<Pick<Target, 'provider' | 'target'>>>(event)

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!target) {
    throw createError({ statusMessage: 'Target is required' })
  } else if (!provider) {
    throw createError({ statusMessage: 'Provider is required' })
  }

  const { data, error } = await supabase
    .from('targets')
    .insert({
      provider,
      user: user.id,
      target,
    })
    .select('id, provider, target, created_at')
    .single()

  if (error) {
    throw createError(error.message)
  }

  return data
})
