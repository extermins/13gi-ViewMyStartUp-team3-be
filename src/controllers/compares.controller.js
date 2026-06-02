import prisma from '../utils/prisma.js'

// GET /api/compares
async function getList(req, res, next) {
  try {
    const parsedIds = req.query.companyIds
      ? req.query.companyIds.split(',').map((id) => Number(id)).filter(Boolean)
      : null

    const allCompanies = await prisma.company.findMany({
      orderBy: { comparisonCount: 'desc' },
      include: { investments: true },
    })

    // 동점이면 동순위 (42→1위, 30→2위, 30→2위, 10→4위)
    let currentRank = 0
    let previousCount = null

    const rankedCompanies = allCompanies.map((company, index) => {
      if (company.comparisonCount !== previousCount) {
        currentRank = index + 1
        previousCount = company.comparisonCount
      }

      return {
        id: company.id,
        name: company.name,
        comparisonCount: company.comparisonCount,
        comparisonRank: currentRank,
        investments: company.investments.map(({ password: _, ...rest }) => rest),
      }
    })

    const companies = parsedIds
      ? rankedCompanies.filter((company) => parsedIds.includes(company.id))
      : rankedCompanies

    return res.json({ companies })
  } catch (error) {
    next(error)
  }
}

// GET /api/compares/:id
async function getOne(req, res, next) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: Number(req.params.id) },
      include: { investments: true },
    })
    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })

    const { investments, ...rest } = company
    res.json({
      ...rest,
      investments: investments.map(({ password: _, ...inv }) => inv),
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/compares/:id/compare
async function addCompare(req, res, next) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })

    const updated = await prisma.company.update({
      where: { id: Number(req.params.id) },
      data: { comparisonCount: { increment: 1 } },
    })
    res.json({ comparisonCount: updated.comparisonCount })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/compares/:id/compare
async function removeCompare(req, res, next) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })

    if (company.comparisonCount <= 0) {
      return res.json({ comparisonCount: 0 })
    }

    const updated = await prisma.company.update({
      where: { id: Number(req.params.id) },
      data: { comparisonCount: { decrement: 1 } },
    })
    res.json({ comparisonCount: updated.comparisonCount })
  } catch (err) {
    next(err)
  }
}

export default { getList, getOne, addCompare, removeCompare }
