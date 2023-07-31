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

  if (provider === 'Telegram') {
    const telegramUsernameRegexp = /.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/
    if (!telegramUsernameRegexp.test(target)) {
      throw createError({ statusMessage: 'Telegram username is invalid' })
    }
  }

  const { data: newTarget, error: newTargetError } = await supabase
    .from('targets')
    .insert({
      provider,
      user: user.id,
      target,
    })
    .select('id, provider, target, confirmed, meta, created_at')
    .single()

  if (newTargetError) {
    throw createError(newTargetError.message)
  }

  return newTarget
})
