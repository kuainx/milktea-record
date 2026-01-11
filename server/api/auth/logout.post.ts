export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (token) {
    const tokenStore = useStorage('tokenStore')
    await tokenStore.removeItem(token)
  }
  deleteCookie(event, 'auth_token')
  return { success: true }
})