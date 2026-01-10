import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { date, brandId, productName, sugar, price, channel } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing order ID',
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
      price: price ? parseFloat(price) : undefined,
      channel,
    },
  })
  return order
})
