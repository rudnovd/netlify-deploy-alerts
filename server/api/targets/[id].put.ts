import { StatusCodes } from 'http-status-codes'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)
  const { provider, target } = await readBody<Readonly<Partial<Target>>>(event)
  const { id } = event.context.params ?? {}

  if (!user?.id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Target id parameter required' })
  } else if (!provider) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Provider required' })
  } else if (!target) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Target required' })
  }

  const { data: updatedTarget, error: updatedTargetError } = await supabase
    .from('targets')
    .update({
      provider,
      target,
    })
    .eq('user', user.id)
    .eq('id', id)
    .select()
    .single()

  if (updatedTargetError) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: updatedTargetError.message })
  }

  return updatedTarget
})
