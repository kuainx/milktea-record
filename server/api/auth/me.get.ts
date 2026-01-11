export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    return { authenticated: false }
  }

  // Get user ID from token store
  const tokenStore = useStorage('tokenStore')
  const userId = await tokenStore.getItem(token)
  
  if (!userId) {
    return { authenticated: false }
  }

  return { 
    authenticated: true,
    userId: parseInt(userId)
  }
})