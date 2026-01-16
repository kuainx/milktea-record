import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing order ID',
    })
  }

  // Check authentication
  if (!event.context.userId) {
    throwUnauthorized(event)
  }

  // Verify the order belongs to the authenticated user
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
  })

  if (!order || order.userId !== event.context.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Order not found or access denied',
    })
  }

  return order
})