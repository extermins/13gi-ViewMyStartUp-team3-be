import { Router } from 'express'
import prisma from '../utils/prisma.js'

const router = Router()

// GET /api/investments?startupId=1
// 투자 목록 조회 — startupId 쿼리로 특정 기업의 투자 내역만 필터링 가능
router.get('/', async (req, res, next) => {
  try {
    const { startupId } = req.query

    // startupId가 없으면 전체 조회, 있으면 해당 기업 투자 내역만 조회
    const where = startupId ? { companyId: Number(startupId) } : {}

    const investments = await prisma.investment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    res.json(investments)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { companyId, amount, name, comment, password } = req.body
    const investment = await prisma.investment.create({
      data: {
        companyId: Number(companyId),
        amount: Number(amount), // 프론트에서 문자열로 넘어올 수 있으므로 Number 변환
        name,
        comment,
        password,
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
    const { amount, name, comment, password } = req.body
    const data = {}

    if (amount !== undefined) data.amount = Number(amount)
    if (name !== undefined) data.name = name
    if (comment !== undefined) data.comment = comment
    if (password !== undefined) data.password = password

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
