import prisma from '../../utils/prisma'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing username or password',
    })
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password',
    })
  }

  // Verify password
  if (password !== user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password',
    })
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex')

  // Store token in memory (in production, use Redis or similar)
  const tokenStore = useStorage('tokenStore')
  await tokenStore.setItem(token, user.id.toString())

  // Set cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: false,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return {
    id: user.id,
    username: user.username,
  }
})