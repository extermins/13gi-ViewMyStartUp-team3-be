import { Router } from 'express'
import prisma from '../utils/prisma.js'

const router = Router()

// GET /api/compares?userId=1
// 비교 목록 조회 — 중첩 include로 compare → companies → company → investments 한 번에 가져옴
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.query
    const where = userId ? { userId: Number(userId) } : {}

    const compares = await prisma.comparison.findMany({
      where,
      include: {
        // ComparisonCompany(중간 테이블)를 통해 연결된 Company까지 JOIN
        companies: {
          include: {
            company: {
              include: { investments: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(compares)
  } catch (err) {
    next(err)
  }
})

// GET /api/compares/:id
// 비교 단건 조회
router.get('/:id', async (req, res, next) => {
  try {
    const compare = await prisma.comparison.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        companies: {
          include: { company: { include: { investments: true } } },
        },
      },
    })
    if (!compare) return res.status(404).json({ message: '비교를 찾을 수 없습니다' })
    res.json(compare)
  } catch (err) {
    next(err)
  }
})

// POST /api/compares
// 비교 세트 생성 — Comparison과 ComparisonCompany 중간 테이블 행을 한 번에 생성
// Prisma의 nested create 문법: companies.create 배열로 중간 테이블 자동 생성
router.post('/', async (req, res, next) => {
  try {
    const { title, userId, companyIds } = req.body

    const compare = await prisma.comparison.create({
      data: {
        title,
        userId: Number(userId),
        companies: {
          // companyIds 배열만큼 ComparisonCompany 행이 생성됨
          create: companyIds.map((companyId) => ({ companyId: Number(companyId) })),
        },
      },
      include: {
        companies: { include: { company: true } },
      },
    })
    res.status(201).json(compare)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/compares/:id
// 비교 삭제 — schema의 onDelete: Cascade로 ComparisonCompany 중간 테이블 행도 자동 삭제됨
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.comparison.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: '삭제되었습니다' })
  } catch (err) {
    next(err)
  }
})

export default router
