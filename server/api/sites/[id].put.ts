import { StatusCodes } from 'http-status-codes'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)
  let { url } = await readBody<Readonly<Partial<Site>>>(event)
  const { enabled } = await readBody<Readonly<Partial<Site>>>(event)
  const { id } = event.context.params ?? {}

  if (!user?.id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Site id parameter required' })
  } else if (url) {
    url = url.toLocaleLowerCase()

    if (url.includes('https://')) {
      url = url.replace('https://', '')
    } else if (url.includes('http://')) {
      url = url.replace('http://', '')
    }

    if (url.includes('/')) {
      url = url.replaceAll('/', '')
    }

    const urlRegexp = /^([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
    if (!new RegExp(urlRegexp).test(url)) {
      throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Wrong URL format' })
    }
  }

  const { data: updatedSite, error: updateSiteError } = await supabase
    .from('sites')
    .update({
      url,
      enabled,
    })
    .eq('user', user.id)
    .eq('id', id)
    .select()
    .single()

  if (updateSiteError) {
    throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: updateSiteError.message })
  }

  return updatedSite
})
