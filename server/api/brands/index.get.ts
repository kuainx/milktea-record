import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const brands = await prisma.brand.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return brands
})
