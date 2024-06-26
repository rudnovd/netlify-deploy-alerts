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

  const { data: alerts, error: alertsError } = await supabase
    .from('alerts')
    .select('id, event, target, text, enabled, site, created_at, updated_at')
    .eq('user', user.id)
    .order('created_at', { ascending: false })
    .order('updated_at', { ascending: false })

  if (alertsError) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: alertsError.message })
  }

  return alerts
})
