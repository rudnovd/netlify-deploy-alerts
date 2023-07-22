import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const { url } = await readBody<Readonly<Pick<Site, 'url'>>>(event)
  const urlRegexp = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!url) {
    throw createError({ statusMessage: 'URL is required' })
  } else if (!new RegExp(urlRegexp).test(url)) {
    throw createError({ statusMessage: 'Wrong URL format' })
  }

  const { data, error } = await supabase
    .from('sites')
    .insert({
      url,
      user: user.id,
    })
    .select('id, url, enabled')
    .single()

  if (error) {
    throw createError(error.message)
  }

  return data
})
