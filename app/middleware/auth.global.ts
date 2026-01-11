export default defineNuxtRouteMiddleware((to, from) => {
  // 需要认证的路由
  const protectedRoutes = ['/record', '/search', '/brands']

  // 检查当前路由是否需要认证
  const requiresAuth = protectedRoutes.includes(to.path)

  if (requiresAuth) {
    // 检查是否存在auth_token cookie
    const authToken = useCookie('auth_token')

    if (!authToken.value) {
      // 如果没有认证token，跳转到首页
      return navigateTo('/')
    }
  }
})