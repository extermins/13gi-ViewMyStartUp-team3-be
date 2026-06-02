import prisma from '../utils/prisma.js'

const ALLOWED_SORT_FIELDS = ['mypickCount', 'comparisonCount', 'totalInvestment', 'investmentCount']
const ALLOWED_DIRECTIONS = ['asc', 'desc']
const MAX_PAGE_SIZE = 50

function parsePositiveInteger(value) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : null
}

// GET /api/comparison-stats
async function getList(req, res, next) {
  try {
    const { sortBy = 'mypickCount', order = 'desc', page = 1, pageSize = 10 } = req.query

    const field = String(sortBy)
    const direction = String(order)
    const currentPage = parsePositiveInteger(page)
    const pageSizeNum = parsePositiveInteger(pageSize)

    if (
      !ALLOWED_SORT_FIELDS.includes(field) ||
      !ALLOWED_DIRECTIONS.includes(direction) ||
      currentPage === null ||
      pageSizeNum === null ||
      pageSizeNum > MAX_PAGE_SIZE
    ) {
      return res.status(400).json({ message: '잘못된 쿼리 파라미터입니다.' })
    }

    const skip = (currentPage - 1) * pageSizeNum

    const allCompanies = await prisma.company.findMany({
      include: {
        investments: {
          select: { amount: true, organization: true },
        },
      },
    })

    const sorted = allCompanies
      .map((company) => ({
        id: company.id,
        name: company.name,
        description: company.description,
        category: company.category,
        imageUrl: company.imageUrl,
        revenue: Number(company.revenue),
        headCount: company.headCount,
        mypickCount: company.mypickCount,
        comparisonCount: company.comparisonCount,
        // organization이 other인 투자만 실제 투자금액으로 합산
        totalInvestment: company.investments.reduce(
          (sum, inv) => (inv.organization === 'other' ? sum + Number(inv.amount) : sum),
          0
        ),
        investmentCount: company.investments.length,
      }))
      .sort((a, b) => {
        const diff = a[field] - b[field]
        return direction === 'desc' ? -diff : diff
      })

    // 동점 동순위 계산 (42→1위, 30→2위, 30→2위, 10→4위)
    let currentRank = 0
    let previousValue = null

    const ranked = sorted.map((company, index) => {
      const value = company[field]
      if (value !== previousValue) {
        currentRank = index + 1
        previousValue = value
      }
      return { rank: currentRank, ...company }
    })

    const totalCount = ranked.length
    const totalPages = Math.ceil(totalCount / pageSizeNum)
    const data = ranked.slice(skip, skip + pageSizeNum)

    return res.json({ data, totalCount, currentPage, pageSize: pageSizeNum, totalPages })
  } catch (error) {
    next(error)
  }
}

export default { getList }
