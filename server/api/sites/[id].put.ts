import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Database } from '~~/types/database.types'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = serverSupabaseClient<Database>(event)
  const { url, enabled } = await readBody<Readonly<Partial<Site>>>(event)
  const { id } = event.context.params ?? {}
  const urlRegexp = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

  if (!user?.id) {
    throw createError({ statusMessage: 'Authorization required' })
  } else if (!id) {
    throw createError({ statusMessage: 'Site id parameter required' })
  } else if (url && !new RegExp(urlRegexp).test(url)) {
    throw createError({ statusMessage: 'Wrong URL format' })
  }

  const { data, error } = await supabase
    .from('sites')
    .update({
      url: url?.replace('https://', ''),
      enabled,
    })
    .eq('user', user.id)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError(error.message)
  }

  return data
})
