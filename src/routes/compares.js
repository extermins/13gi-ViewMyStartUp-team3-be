import { Router } from 'express'
import prisma from '../utils/prisma.js'

const router = Router()

// API-304: 비교 현황 조회
// companyIds 쿼리 파라미터로 특정 기업들의 비교 횟수 + 전체 순위 반환
router.get('/', async (req, res, next) => {
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
        // password 필드 제거 — 클라이언트에 비밀번호 노출 방지
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
})

router.get('/:id', async (req, res, next) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: Number(req.params.id) },
      include: { investments: true },
    })
    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })
    res.json(company)
  } catch (err) {
    next(err)
  }
})

export default router
