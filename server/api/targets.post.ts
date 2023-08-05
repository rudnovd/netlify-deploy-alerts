import { StatusCodes } from 'http-status-codes'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)
  const { provider, target } = await readBody<Readonly<Pick<Target, 'provider' | 'target'>>>(event)

  if (!user?.id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Authorization required' })
  } else if (!target) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Target is required' })
  } else if (!provider) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Provider is required' })
  }

  if (provider === 'Telegram') {
    const telegramUsernameRegexp = /.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/
    if (!telegramUsernameRegexp.test(target)) {
      throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Telegram username is invalid' })
    }
  }

  const { data: alreadyExistTarget, error: alreadyExistTargetError } = await supabase
    .from('targets')
    .select('id')
    .eq('provider', provider)
    .eq('target', target)
    .eq('user', user.id)
    .single()

  if (alreadyExistTargetError) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: alreadyExistTargetError.message })
  } else if (alreadyExistTarget) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `Target ${target} already exists` })
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
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: newTargetError.message })
  }

  return newTarget
})
