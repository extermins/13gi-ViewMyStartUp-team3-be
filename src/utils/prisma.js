import { PrismaClient } from '@prisma/client'

// 싱글턴 패턴 — 매 요청마다 new PrismaClient()를 호출하면
// DB 연결 풀이 소진될 수 있기 때문에 모듈 레벨에서 한 번만 생성해 재사용
const prisma = new PrismaClient()

export default prisma
