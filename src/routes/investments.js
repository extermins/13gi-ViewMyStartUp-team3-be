import { Router } from 'express'
import prisma from '../utils/prisma.js'

const router = Router()

// 투자 정렬 기준 변환 — amount | createdAt만 허용 (검색 없이 정렬/페이지네이션 중심)
function resolveInvestmentOrderBy(sort) {
  const allowed = ['amount', 'createdAt']
  const field = allowed.includes(sort) ? sort : 'createdAt'
  return { [field]: 'desc' }
}

// GET /api/investments?startupId=1&page=1&limit=5&sort=amount
// 투자 목록 조회 — startupId 필터 + 페이지네이션 + 정렬 지원
router.get('/', async (req, res, next) => {
  try {
    const { startupId, page = 1, limit = 5, sort = 'createdAt' } = req.query

    const where = startupId ? { companyId: Number(startupId) } : {}
    const skip = (Number(page) - 1) * Number(limit)

    // 목록 + 전체 건수 + 총 투자금액을 동시에 조회
    const [investments, total, aggregate] = await Promise.all([
      prisma.investment.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: resolveInvestmentOrderBy(sort),
      }),
      prisma.investment.count({ where }),
      // 해당 기업(또는 전체)의 투자 금액 합산
      prisma.investment.aggregate({
        where,
        _sum: { amount: true },
      }),
    ])

    // password 필드 제거 — 클라이언트에 비밀번호 노출 방지
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
})

router.post('/', async (req, res, next) => {
  try {
    const { companyId, amount, name, comment, password, organization } = req.body
    const investment = await prisma.investment.create({
      data: {
        companyId: Number(companyId),
        amount: Number(amount), // 프론트에서 문자열로 넘어올 수 있으므로 Number 변환
        name,
        comment,
        password,
        organization,
      },
    })

    // 응답에서 password 필드 제거 — 클라이언트에 비밀번호 노출 방지
    const { password: _, ...safeInvestment } = investment
    res.status(201).json(safeInvestment)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { amount, name, comment, password, organization } = req.body

    // 수정 전 기존 투자 내역 조회 — 비밀번호 검증을 위해 필요
    const existing = await prisma.investment.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!existing) {
      return res.status(404).json({ message: '투자 내역을 찾을 수 없습니다' })
    }

    // 비밀번호가 설정된 투자는 일치 여부 검증 후 수정 허용
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
})

// DELETE /api/investments/:id
// password가 저장된 투자는 일치 여부 확인 후 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const { password } = req.body
    const investment = await prisma.investment.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!investment) {
      return res.status(404).json({ message: '투자 내역을 찾을 수 없습니다' })
    }

    // password가 설정된 투자는 일치 여부 검증
    // MVP용 평문 비교 — 실제 서비스에서는 절대 평문 비교 금지, bcrypt.compare() 필요
    if (investment.password && investment.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' })
    }

    await prisma.investment.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: '삭제되었습니다' })
  } catch (err) {
    next(err)
  }
})

export default router
