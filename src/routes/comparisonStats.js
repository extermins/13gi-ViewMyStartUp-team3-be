import { Router } from 'express'
import prisma from '../utils/prisma.js'

const router = Router()

// 허용된 정렬 필드
// - mypickCount: 나의 기업 선택 횟수
// - comparisonCount: 비교 기업 선택 횟수
// - totalInvestment: 실제 투자금액
// - investmentCount: 투자 건수
const ALLOWED_SORT_FIELDS = ['mypickCount', 'comparisonCount', 'totalInvestment', 'investmentCount']
const ALLOWED_DIRECTIONS = ['asc', 'desc']
const MAX_PAGE_SIZE = 50

function parsePositiveInteger(value) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : null
}

// API-305 + API-306: 비교 현황 정렬 + 페이지네이션 조회
// GET /api/comparison-stats?sortBy=mypickCount&order=desc&page=1&pageSize=10
// - sortBy: 정렬 기준 필드 (mypickCount | comparisonCount | totalInvestment | investmentCount)
// - order: 정렬 방향 (asc | desc)
// - page: 페이지 번호 (기본값 1)
// - pageSize: 페이지당 항목 수 (기본값 10)
router.get('/', async (req, res, next) => {
  try {
    const {
      sortBy = 'mypickCount',
      order = 'desc',
      page = 1,
      pageSize = 10,
    } = req.query

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

    // 모든 기업 + 투자 금액 합산을 위해 investments 포함 조회
    const allCompanies = await prisma.company.findMany({
      include: {
        investments: {
          select: {
            amount: true,
            organization: true,
          },
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
        // 실제 투자금액: organization이 other인 투자만 합산
        totalInvestment: company.investments.reduce(
          (sum, inv) =>
            inv.organization === 'other' ? sum + Number(inv.amount) : sum,
          0
        ),
        // 투자 건수
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

    // 페이지네이션 적용 (API-306)
    const totalCount = ranked.length
    const totalPages = Math.ceil(totalCount / pageSizeNum)
    const data = ranked.slice(skip, skip + pageSizeNum)

    return res.json({
      data,
      totalCount,
      currentPage,
      pageSize: pageSizeNum,
      totalPages,
    })
  } catch (error) {
    next(error)
  }
})

export default router
