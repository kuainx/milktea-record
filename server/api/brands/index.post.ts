import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, logo } = body

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Brand name is required',
    })
  }

  const brand = await prisma.brand.create({
    data: {
      name,
      logo,
    },
  })
  return brand
})
