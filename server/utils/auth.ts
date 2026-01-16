import { H3Event } from 'h3'

/**
 * 统一处理未授权错误，清除 cookie 并抛出 401 错误
 */
export const throwUnauthorized = (event: H3Event, message: string = 'Unauthorized') => {
  deleteCookie(event, 'auth_token')
  throw createError({
    statusCode: 401,
    statusMessage: message,
  })
}
