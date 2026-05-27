import { Router } from 'express'
import prisma from '../utils/prisma.js'

const router = Router()

function resolveOrderBy(sortBy, order) {
  const allowedSortFields = ['mypickCount', 'comparisonCount', 'revenue', 'createdAt']
  const allowedOrders = ['asc', 'desc']

  const field = allowedSortFields.includes(sortBy) ? sortBy : 'mypickCount'
  const direction = allowedOrders.includes(order) ? order : 'desc'

  return { [field]: direction }
}

router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'mypickCount',
      order = 'desc',
    } = req.query

    const skip = (Number(page) - 1) * Number(pageSize)
    const take = Number(pageSize)

    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        skip,
        take,
        orderBy: resolveOrderBy(sortBy, order),
      }),
      prisma.company.count(),
    ])

    res.json({
      data: companies,
      totalCount,
      page: Number(page),
      pageSize: take,
    })
  } catch (err) {
    next(err)
  }
})

export default router
