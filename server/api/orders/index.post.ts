import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { date, brandId, productName, sugar, price, channel } = body

  if (!date || !brandId || !productName || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  const order = await prisma.order.create({
    data: {
      date: new Date(date),
      brandId: parseInt(brandId),
      productName,
      sugar: sugar || 'Standard',
      price: parseFloat(price),
      channel: channel || 'Store',
    },
  })
  return order
})
