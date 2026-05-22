import { Router } from 'express'
import prisma from '../utils/prisma.js'

// Router()로 라우터 인스턴스 생성 — index.js에서 app.use('/api/startups', router)로 연결됨
const router = Router()

// 프론트엔드가 보내는 sort 값을 Prisma orderBy 형식으로 변환
// 지원 값: revenue | mypickCount | comparisonCount | createdAt (기본값)
function resolveOrderBy(sort) {
  const allowed = ['revenue', 'mypickCount', 'comparisonCount', 'createdAt']
  const field = allowed.includes(sort) ? sort : 'createdAt'
  return { [field]: 'desc' }
}

// GET /api/startups?page=1&limit=10&sort=mypickCount&keyword=카카오
// 기업 목록 조회 — 페이지네이션 + 정렬 + 키워드 검색 지원
router.get('/', async (req, res, next) => {
  try {
    // 쿼리 파라미터가 없으면 기본값 사용
    const { page = 1, limit = 10, sort = 'createdAt', keyword = '' } = req.query

    // 몇 번째 항목부터 가져올지 계산 (페이지네이션 공식)
    // 예: page=2, limit=10 → skip=10 (11번째부터)
    const skip = (Number(page) - 1) * Number(limit)

    // keyword가 있을 때만 name 검색 조건 추가
    // mode: 'insensitive' → 대소문자 구분 없이 검색 (PostgreSQL 전용)
    const where = keyword
      ? { name: { contains: keyword, mode: 'insensitive' } }
      : {}

    // Promise.all로 목록 조회와 전체 개수를 동시에 요청 → 순차 요청보다 빠름
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: Number(limit),
        // include: 연관 테이블 데이터를 JOIN해서 함께 가져옴
        include: { investments: true },
        orderBy: resolveOrderBy(sort),
      }),
      prisma.company.count({ where }),
    ])

    // 프론트엔드에서 페이지네이션 UI를 그릴 수 있도록 total도 함께 반환
    res.json({ companies, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    // try-catch 후 next(err)로 넘기면 errorHandler 미들웨어가 처리
    next(err)
  }
})

// GET /api/startups/:id
// 기업 단건 조회 — URL 파라미터로 id를 받음
router.get('/:id', async (req, res, next) => {
  try {
    const company = await prisma.company.findUnique({
      // req.params.id는 문자열이므로 Number()로 변환 필수
      where: { id: Number(req.params.id) },
      include: { investments: true },
    })

    // 존재하지 않는 id 요청 시 404 반환
    if (!company) return res.status(404).json({ message: '기업을 찾을 수 없습니다' })
    res.json(company)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      description,
      headCount,
      headcount,
      category,
      imageUrl,
      revenue,
      mypickCount,
      comparisonCount,
    } = req.body

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
    // 생성 성공 시 201 Created 반환
    res.status(201).json(company)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const {
      name,
      description,
      headCount,
      headcount,
      category,
      imageUrl,
      revenue,
      mypickCount,
      comparisonCount,
    } = req.body
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
})

// DELETE /api/startups/:id
// 기업 삭제 — schema의 onDelete: Cascade로 연관 Investment도 자동 삭제됨
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.company.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: '삭제되었습니다' })
  } catch (err) {
    next(err)
  }
})

export default router
