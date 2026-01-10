import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, logo } = body

  if (!id) {
     throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const brand = await prisma.brand.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      logo,
    },
  })
  return brand
})
