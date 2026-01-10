import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
     throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const order = await prisma.order.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      brand: true,
    },
  })
  return order
})
