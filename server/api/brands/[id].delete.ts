import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
     throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  // Check if there are orders associated with this brand
  const ordersCount = await prisma.order.count({
    where: {
        brandId: parseInt(id)
    }
  })

  if (ordersCount > 0) {
      throw createError({
          statusCode: 400,
          statusMessage: 'Cannot delete brand with existing orders'
      })
  }

  const brand = await prisma.brand.delete({
    where: {
      id: parseInt(id),
    },
  })
  return brand
})
