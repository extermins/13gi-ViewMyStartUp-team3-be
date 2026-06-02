import prisma from '../utils/prisma.js'

function resolveOrderBy(sort) {
  const allowed = ['revenue', 'mypickCount', 'comparisonCount', 'createdAt']
  const field = allowed.includes(sort) ? sort : 'createdAt'
  return { [field]: 'desc' }
}

// GET /api/startups
async function getList(req, res, next) {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', keyword = '' } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = keyword
      ? { name: { contains: keyword, mode: 'insensitive' } }
      : {}

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: Number(limit),
        include: { investments: true },
        orderBy: resolveOrderBy(sort),
      }),
      prisma.company.count({ where }),
    ])

    res.json({ companies, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/startups/:id
async function getOne(req, res, next) {
  try {
    const companyId = Number(req.params.id)

    const [company, investmentAggregate] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.investment.aggregate({
        where: { companyId },
        _sum: { amount: true },
      }),
    ])

    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })

    const totalInvestment = investmentAggregate._sum.amount ?? 0

    // 나보다 투자금액 합산이 높은 기업 수 + 1 = 내 순위
    const higherCompanies = await prisma.investment.groupBy({
      by: ['companyId'],
      _sum: { amount: true },
      having: {
        amount: { _sum: { gt: totalInvestment } },
      },
    })

    const investmentRank = higherCompanies.length + 1
    res.json({ ...company, totalInvestment, investmentRank })
  } catch (err) {
    next(err)
  }
}

// POST /api/startups
async function create(req, res, next) {
  try {
    const { name, description, headCount, headcount, category, imageUrl, revenue, mypickCount, comparisonCount } = req.body

    const company = await prisma.company.create({
      data: {
        name,
        description,
        headCount: Number(headCount ?? headcount),
        category,
        imageUrl,
        revenue: Number(revenue),
        mypickCount: Number(mypickCount ?? 0),
        comparisonCount: Number(comparisonCount ?? 0),
      },
    })
    res.status(201).json(company)
  } catch (err) {
    next(err)
  }
}

// PUT /api/startups/:id
async function update(req, res, next) {
  try {
    const { name, description, headCount, headcount, category, imageUrl, revenue, mypickCount, comparisonCount } = req.body
    const data = {}

    if (name !== undefined) data.name = name
    if (description !== undefined) data.description = description
    if (headCount !== undefined || headcount !== undefined) {
      data.headCount = Number(headCount ?? headcount)
    }
    if (category !== undefined) data.category = category
    if (imageUrl !== undefined) data.imageUrl = imageUrl
    if (revenue !== undefined) data.revenue = Number(revenue)
    if (mypickCount !== undefined) data.mypickCount = Number(mypickCount)
    if (comparisonCount !== undefined) data.comparisonCount = Number(comparisonCount)

    const company = await prisma.company.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(company)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/startups/:id
async function remove(req, res, next) {
  try {
    await prisma.company.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: '삭제되었습니다' })
  } catch (err) {
    next(err)
  }
}

// POST /api/startups/:id/mypick
async function addMypick(req, res, next) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })

    const updated = await prisma.company.update({
      where: { id: Number(req.params.id) },
      data: { mypickCount: { increment: 1 } },
    })
    res.json({ mypickCount: updated.mypickCount })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/startups/:id/mypick
async function removeMypick(req, res, next) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })

    if (company.mypickCount <= 0) {
      return res.json({ mypickCount: 0 })
    }

    const updated = await prisma.company.update({
      where: { id: Number(req.params.id) },
      data: { mypickCount: { decrement: 1 } },
    })
    res.json({ mypickCount: updated.mypickCount })
  } catch (err) {
    next(err)
  }
}

export default { getList, getOne, create, update, remove, addMypick, removeMypick }
