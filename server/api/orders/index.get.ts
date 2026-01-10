import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { date, startDate, endDate, brandId, productName } = query

  const where: any = {}

  if (date) {
    const searchDate = new Date(String(date))
    const startOfDay = new Date(searchDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(searchDate)
    endOfDay.setHours(23, 59, 59, 999)

    where.date = {
      gte: startOfDay,
      lte: endOfDay,
    }
  } else {
    if (startDate) {
      where.date = { ...where.date, gte: new Date(String(startDate)) }
    }
    if (endDate) {
       // Set to end of that day
       const end = new Date(String(endDate))
       end.setHours(23, 59, 59, 999)
       where.date = { ...where.date, lte: end }
    }
  }

  if (brandId) {
    where.brandId = parseInt(String(brandId))
  }

  if (productName) {
    where.productName = {
      contains: String(productName),
    }
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      brand: true,
    },
    orderBy: {
      date: 'desc',
    },
  })
  return orders
})
