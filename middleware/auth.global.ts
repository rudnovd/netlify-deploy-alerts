export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const router = useRouter()
  const publicRoutes = ['/', '/signin', '/signout']

  if (!user.value && !publicRoutes.includes(to.path)) {
    router.push('/signin')
  } else if (user.value && to.path === '/signin') {
    router.push('/sites')
  }
})
