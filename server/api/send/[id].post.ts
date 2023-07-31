import { Database } from '~~/types/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseClient<Database>(event)
  const headers = getRequestHeaders(event)
  const config = useRuntimeConfig()
  const { id } = event.context.params || {}

  if (!id) {
    throw createError({ statusMessage: 'Alert id parameter required' })
  } else if (!headers['x-netlify-event']) {
    throw createError({ statusMessage: 'Netlify event missing' })
  }

  const { data: alert, error: alertError } = await supabase
    .from('alerts')
    .select('target, site, text, enabled')
    .eq('id', id)
    .single()

  if (alertError) {
    throw createError(alertError.message)
  }

  const { data: site, error: siteError } = await supabase.from('sites').select('enabled').eq('id', alert.site).single()

  if (siteError) {
    throw createError(siteError.message)
  }

  const { data: target, error: targetError } = await supabase
    .from('targets')
    .select('meta, provider, target, confirmed')
    .eq('id', alert.target)
    .single()

  if (targetError) {
    throw createError(targetError.message)
  }

  if (target.provider === 'Telegram') {
    if (!target.confirmed) {
      throw createError({ statusMessage: `Confirmation required, please visit ${config.public.telegramBotLink}` })
    } else if (!target.meta) {
      throw createError({ statusMessage: `User id not found, please visit ${config.public.telegramBotLink}` })
    } else if (!target.target) {
      throw createError({ statusMessage: `Terget not found, please visit ${config.public.telegramBotLink}` })
    } else if (!site.enabled || !alert.enabled) {
      return {
        statusCode: 200,
        statusMessage: 'OK',
      }
    }

    const telegraf = useTelegraf()
    await telegraf.telegram.sendMessage(target.meta, alert.text)
    return {
      statusCode: 200,
      statusMessage: 'Alert sended',
    }
  } else if (!target.provider) {
    return {
      statusCode: 404,
      statusMessage: 'Alert provider not found',
    }
  }
})
