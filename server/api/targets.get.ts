import { createError } from 'h3'
import { StatusCodes } from 'http-status-codes'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)

  if (!user?.id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Authorization required' })
  }

  const { data: targets, error: targetsErrors } = await supabase
    .from('targets')
    .select('id, provider, target, meta, confirmed, created_at')
    .eq('user', user.id)
    .order('created_at', { ascending: false })

  if (targetsErrors) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: targetsErrors.message })
  }

  return targets
})
