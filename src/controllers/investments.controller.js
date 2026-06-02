import prisma from '../utils/prisma.js'

function resolveOrderBy(sort) {
  const allowed = ['amount', 'createdAt']
  const field = allowed.includes(sort) ? sort : 'createdAt'
  return { [field]: 'desc' }
}

// GET /api/investments
async function getList(req, res, next) {
  try {
    const { startupId, page = 1, limit = 5, sort = 'createdAt' } = req.query
    const where = startupId ? { companyId: Number(startupId) } : {}
    const skip = (Number(page) - 1) * Number(limit)

    const [investments, total, aggregate] = await Promise.all([
      prisma.investment.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: resolveOrderBy(sort),
      }),
      prisma.investment.count({ where }),
      prisma.investment.aggregate({
        where,
        _sum: { amount: true },
      }),
    ])

    const safeInvestments = investments.map(({ password: _, ...rest }) => rest)
    res.json({
      investments: safeInvestments,
      total,
      totalAmount: aggregate._sum.amount ?? 0,
      page: Number(page),
      limit: Number(limit),
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/investments
async function create(req, res, next) {
  try {
    const { companyId, amount, name, comment, password, organization } = req.body
    const investment = await prisma.investment.create({
      data: {
        companyId: Number(companyId),
        amount: Number(amount),
        name,
        comment,
        password,
        organization,
      },
    })

    const { password: _, ...safeInvestment } = investment
    res.status(201).json(safeInvestment)
  } catch (err) {
    next(err)
  }
}

// PUT /api/investments/:id
async function update(req, res, next) {
  try {
    const { amount, name, comment, password, organization } = req.body

    const existing = await prisma.investment.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!existing) {
      return res.status(404).json({ message: '투자 내역을 찾을 수 없습니다' })
    }

    if (existing.password && existing.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' })
    }

    const data = {}
    if (amount !== undefined) data.amount = Number(amount)
    if (name !== undefined) data.name = name
    if (comment !== undefined) data.comment = comment
    if (organization !== undefined) data.organization = organization

    const investment = await prisma.investment.update({
      where: { id: Number(req.params.id) },
      data,
    })

    const { password: _, ...safeInvestment } = investment
    res.json(safeInvestment)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/investments/:id
async function remove(req, res, next) {
  try {
    const { password } = req.body
    const investment = await prisma.investment.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!investment) {
      return res.status(404).json({ message: '투자 내역을 찾을 수 없습니다' })
    }

    // MVP용 평문 비교 — 실제 서비스에서는 bcrypt.compare() 필요
    if (investment.password && investment.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' })
    }

    await prisma.investment.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: '삭제되었습니다' })
  } catch (err) {
    next(err)
  }
}

export default { getList, create, update, remove }
