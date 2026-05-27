import { Router } from 'express'
import prisma from '../utils/prisma.js'

const router = Router()

// 허용된 정렬 필드 (API-305: 비교 현황 정렬 조회)
const ALLOWED_ORDER_BY_FIELDS = ['mypickCount', 'totalInvestment']
const ALLOWED_SORT_BY_DIRECTIONS = ['asc', 'desc']

// API-305 + API-306: 비교 현황 정렬 + 페이지네이션 조회
// GET /api/comparison-stats?orderBy=mypickCount&sortBy=desc&page=1&size=5
// - orderBy: 정렬 기준 필드 (mypickCount | totalInvestment)
// - sortBy: 정렬 방향 (asc | desc)
// - page: 페이지 번호 (기본값 1)
// - size: 페이지당 항목 수 (기본값 10)
router.get('/', async (req, res, next) => {
  try {
    const {
      orderBy = 'mypickCount',
      sortBy = 'desc',
      page = 1,
      size = 10,
    } = req.query

    // 유효하지 않은 값은 기본값으로 대체
    const field = ALLOWED_ORDER_BY_FIELDS.includes(orderBy) ? orderBy : 'mypickCount'
    const direction = ALLOWED_SORT_BY_DIRECTIONS.includes(sortBy) ? sortBy : 'desc'
    const currentPage = Math.max(1, Number(page))
    const pageSize = Math.max(1, Number(size))
    const skip = (currentPage - 1) * pageSize

    // 모든 기업 + 투자 금액 합산을 위해 investments 포함 조회
    const allCompanies = await prisma.company.findMany({
      include: {
        investments: {
          select: { amount: true },
        },
      },
    })

    // 실제 누적 투자 금액 계산 후 정렬
    const sorted = allCompanies
      .map((company) => ({
        id: company.id,
        name: company.name,
        description: company.description,
        category: company.category,
        imageUrl: company.imageUrl,
        // BigInt → Number 변환 (JSON 직렬화 에러 방지)
        revenue: Number(company.revenue),
        headCount: company.headCount,
        mypickCount: company.mypickCount,
        // 비교 현황 페이지에서 정렬/표시 기준으로 활용될 수 있어 포함
        comparisonCount: company.comparisonCount,
        // BigInt → Number 변환 후 합산
        totalInvestment: company.investments.reduce(
          (sum, inv) => sum + Number(inv.amount),
          0
        ),
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

    // 페이지네이션 적용 (API-306)
    const totalCount = ranked.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const companies = ranked.slice(skip, skip + pageSize)

    return res.json({
      companies,
      totalCount,
      currentPage,
      pageSize,
      totalPages,
    })
  } catch (error) {
    next(error)
  }
})

export default router
