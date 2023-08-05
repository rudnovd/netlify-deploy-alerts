import { StatusCodes } from 'http-status-codes'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (h3Event) => {
  const user = await serverSupabaseUser(h3Event)
  const supabase = await serverSupabaseClient<Database>(h3Event)
  const { target, event, text, site } = await readBody<Readonly<Pick<Alert, 'target' | 'event' | 'text' | 'site'>>>(
    h3Event,
  )

  if (!user?.id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Authorization required' })
  } else if (!event) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Event is required' })
  } else if (!text) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Text is required' })
  } else if (!target) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Target is required' })
  } else if (!site) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Site is required' })
  }

  const { data: newAlert, error: newAlertError } = await supabase
    .from('alerts')
    .insert({
      event,
      target,
      user: user.id,
      text,
      site,
    })
    .select('id, event, target, text, site, enabled, created_at, updated_at')
    .single()

  if (newAlertError) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: newAlertError.message })
  }

  return newAlert
})
