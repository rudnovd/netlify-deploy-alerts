import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  let { url } = await readBody<Readonly<Pick<Site, 'url'>>>(event)
  const urlRegexp = /^([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!url) {
    throw createError({ statusMessage: 'URL is required' })
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

    if (!new RegExp(urlRegexp).test(url)) {
      throw createError({ statusMessage: 'Wrong URL format' })
    }
  }

  const { data: alreadyExistSites, error: alreadyExistSitesError } = await supabase
    .from('sites')
    .select('id')
    .eq('user', user.id)
    .eq('url', url)

  if (alreadyExistSitesError) {
    throw createError(alreadyExistSitesError.message)
  } else if (alreadyExistSites?.length) {
    throw createError({ statusMessage: 'Site already exists' })
  }

  const { data: newSite, error: newSiteError } = await supabase
    .from('sites')
    .insert({
      url,
      user: user.id,
    })
    .select('id, url, enabled')
    .single()

  if (newSiteError) {
    throw createError(newSiteError.message)
  }

  return newSite
})
