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

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username already exists',
    })
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  })

  // Generate token
  const token = crypto.randomBytes(32).toString('hex')

  // Store token in memory (in production, use Redis or similar)
  const tokenStore = useStorage('tokenStore')
  await tokenStore.setItem(token, user.id.toString())

  // Set cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return {
    id: user.id,
    username: user.username,
  }
})