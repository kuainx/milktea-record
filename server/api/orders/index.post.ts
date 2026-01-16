import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { date, brandId, productName, sugar, temperature, toppings, price, channel, evaluation } = body

  if (!date || !brandId || !productName || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  // Check authentication
  if (!event.context.userId) {
    throwUnauthorized(event)
  }

  const order = await prisma.order.create({
    data: {
      date: new Date(date),
      brandId: parseInt(brandId),
      userId: event.context.userId,
      productName,
      sugar: sugar || '标准糖',
      temperature: temperature || '正常冰',
      toppings,
      price: parseFloat(price),
      channel: channel || '小程序',
      evaluation,
    },
  })
  return order
})