import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { date, brandId, productName, sugar, temperature, toppings, price, channel } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing order ID',
    })
  }

  // Check authentication
  if (!event.context.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Verify the order belongs to the authenticated user
  const existingOrder = await prisma.order.findUnique({
    where: { id: parseInt(id) },
  })

  if (!existingOrder || existingOrder.userId !== event.context.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Order not found or access denied',
    })
  }

  const order = await prisma.order.update({
    where: {
      id: parseInt(id),
    },
    data: {
      date: date ? new Date(date) : undefined,
      brandId: brandId ? parseInt(brandId) : undefined,
      productName,
      sugar,
      temperature,
      toppings,
      price: price ? parseFloat(price) : undefined,
      channel,
    },
  })
  return order
})