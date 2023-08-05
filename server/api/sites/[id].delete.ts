import { createError } from 'h3'
import { StatusCodes } from 'http-status-codes'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)
  const { id } = event.context.params ?? {}

  if (!user?.id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Site id parameter required' })
  }

  const { error: alertsDeleteError } = await supabase.from('alerts').delete().eq('user', user.id).eq('site', id)
  if (alertsDeleteError) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: alertsDeleteError.message })
  }

  const { error: siteDeleteError } = await supabase.from('sites').delete().eq('user', user.id).eq('id', id)
  if (siteDeleteError) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: siteDeleteError.message })
  }

  return true
})
