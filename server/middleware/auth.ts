export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token');
  event.context.userId = null;
  if (token) {
    const tokenStore = useStorage('tokenStore');
    const userId = await tokenStore.getItem(token);
    if (userId) {
      event.context.userId = parseInt(userId);
    }
  }
});
