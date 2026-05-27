import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 테스트용 스타트업 데이터 — 실제 서비스 투입 전 반드시 삭제
const companies = [
  {
    name: '카카오',
    description: '국내 최대 모바일 메신저 카카오톡을 운영하며, 다양한 IT 서비스를 제공하는 플랫폼 기업입니다.',
    headCount: 12000,
    category: 'IT/소프트웨어',
    imageUrl: 'https://placehold.co/200x200?text=Kakao',
    revenue: 8200000,
    mypickCount: 134,
    comparisonCount: 98,
  },
  {
    name: '토스',
    description: '간편 송금으로 시작해 은행, 증권, 보험까지 아우르는 종합 핀테크 플랫폼입니다.',
    headCount: 3200,
    category: '핀테크',
    imageUrl: 'https://placehold.co/200x200?text=Toss',
    revenue: 1570000,
    mypickCount: 112,
    comparisonCount: 87,
  },
  {
    name: '마켓컬리',
    description: '신선식품 새벽 배송 서비스를 선도하며 프리미엄 식료품 이커머스 시장을 개척한 기업입니다.',
    headCount: 2800,
    category: '이커머스',
    imageUrl: 'https://placehold.co/200x200?text=Kurly',
    revenue: 2100000,
    mypickCount: 76,
    comparisonCount: 54,
  },
  {
    name: '당근마켓',
    description: '지역 기반 중고거래 플랫폼으로, 이웃 간 연결을 통한 동네 커뮤니티 서비스를 제공합니다.',
    headCount: 780,
    category: 'IT/소프트웨어',
    imageUrl: 'https://placehold.co/200x200?text=Daangn',
    revenue: 340000,
    mypickCount: 98,
    comparisonCount: 71,
  },
  {
    name: '뤼튼테크놀로지스',
    description: 'AI 기반 콘텐츠 생성 플랫폼으로, 다양한 산업군에 생성형 AI 솔루션을 제공합니다.',
    headCount: 210,
    category: 'AI/데이터',
    imageUrl: 'https://placehold.co/200x200?text=Wrtn',
    revenue: 85000,
    mypickCount: 64,
    comparisonCount: 42,
  },
  {
    name: '클래스101',
    description: '취미부터 직무까지 온라인 클래스를 제공하는 에듀테크 플랫폼으로, 크리에이터 경제를 지원합니다.',
    headCount: 420,
    category: '교육/에듀테크',
    imageUrl: 'https://placehold.co/200x200?text=Class101',
    revenue: 230000,
    mypickCount: 55,
    comparisonCount: 38,
  },
  {
    name: '야놀자',
    description: '숙박 예약에서 레저·액티비티까지 확장한 트래블 테크 기업으로 글로벌 시장에 진출 중입니다.',
    headCount: 4500,
    category: 'IT/소프트웨어',
    imageUrl: 'https://placehold.co/200x200?text=Yanolja',
    revenue: 740000,
    mypickCount: 83,
    comparisonCount: 60,
  },
  {
    name: '직방',
    description: '부동산 정보 플랫폼으로, AI와 3D 기술을 활용한 비대면 집 보기 서비스를 제공합니다.',
    headCount: 650,
    category: '프롭테크',
    imageUrl: 'https://placehold.co/200x200?text=Zigbang',
    revenue: 180000,
    mypickCount: 47,
    comparisonCount: 33,
  },
  {
    name: '오늘의집',
    description: '인테리어 콘텐츠와 이커머스를 결합한 라이프스타일 플랫폼입니다.',
    headCount: 900,
    category: '이커머스',
    imageUrl: 'https://placehold.co/200x200?text=OhHouse',
    revenue: 420000,
    mypickCount: 70,
    comparisonCount: 48,
  },
  {
    name: '에이슬립',
    description: '수면 데이터 분석 AI를 개발해 헬스케어 기업 및 병원에 솔루션을 제공하는 딥테크 스타트업입니다.',
    headCount: 85,
    category: '바이오/헬스케어',
    imageUrl: 'https://placehold.co/200x200?text=Asleep',
    revenue: 12000,
    mypickCount: 31,
    comparisonCount: 22,
  },
]

// 각 기업에 딸린 투자 내역 — companyName으로 매핑 후 companyId 치환
const investmentTemplates = [
  {
    companyName: '카카오',
    investments: [
      { name: '김민준', organization: '알토스벤처스', amount: 5000000, comment: '플랫폼 확장성과 수익 다각화 전략이 인상적입니다.', password: 'pass1234' },
      { name: '이서연', organization: '소프트뱅크벤처스', amount: 3200000, comment: '글로벌 경쟁력이 충분하다고 판단합니다.', password: 'kakao0101' },
      { name: '박지훈', organization: '카카오벤처스', amount: 8000000, comment: '핵심 서비스의 MAU 성장세가 안정적입니다.', password: 'invest99' },
    ],
  },
  {
    companyName: '토스',
    investments: [
      { name: '최현우', organization: 'Kleiner Perkins', amount: 4500000, comment: '핀테크 규제 환경 변화 속에서도 꾸준한 성장을 보여줍니다.', password: 'toss2024' },
      { name: '정수아', organization: 'Sequoia Capital', amount: 6000000, comment: '슈퍼앱 전략이 한국 시장에서 유효하게 작동하고 있습니다.', password: 'seq0202' },
    ],
  },
  {
    companyName: '마켓컬리',
    investments: [
      { name: '한도윤', organization: 'DST Global', amount: 2000000, comment: '새벽 배송 물류 시스템의 진입장벽이 높습니다.', password: 'kurly99' },
      { name: '윤지아', organization: '미래에셋벤처투자', amount: 900000, comment: '신선식품 카테고리 내 브랜드 충성도가 높습니다.', password: 'invest22' },
      { name: '임재원', organization: 'GIC', amount: 3500000, comment: '수익성 개선 로드맵이 구체적입니다.', password: 'gic0303' },
    ],
  },
  {
    companyName: '당근마켓',
    investments: [
      { name: '송민서', organization: 'Goodwater Capital', amount: 1800000, comment: '지역 커뮤니티 네트워크 효과가 강력합니다.', password: 'daangn1' },
      { name: '오서준', organization: '카카오벤처스', amount: 700000, comment: '중고거래 외 로컬 광고 모델에 기대가 큽니다.', password: 'local22' },
    ],
  },
  {
    companyName: '뤼튼테크놀로지스',
    investments: [
      { name: '강태양', organization: '스마일게이트인베스트먼트', amount: 500000, comment: 'B2B AI 솔루션 전환 전략이 명확합니다.', password: 'wrtn2024' },
    ],
  },
  {
    companyName: '클래스101',
    investments: [
      { name: '배나연', organization: 'KTB네트워크', amount: 600000, comment: '크리에이터 이코노미 성장과 함께 수혜가 예상됩니다.', password: 'class00' },
      { name: '조민혁', organization: '컴퍼니케이파트너스', amount: 280000, comment: '글로벌 확장 가능성을 높게 평가합니다.', password: 'invest55' },
    ],
  },
  {
    companyName: '야놀자',
    investments: [
      { name: '신유진', organization: 'SoftBank Vision Fund', amount: 9000000, comment: '여행 수요 회복과 함께 강력한 성장이 예상됩니다.', password: 'yanolja1' },
      { name: '권지후', organization: 'GIC', amount: 5500000, comment: '글로벌 트래블테크 시장에서의 포지셔닝이 좋습니다.', password: 'gic0404' },
    ],
  },
  {
    companyName: '직방',
    investments: [
      { name: '문서아', organization: '산업은행', amount: 800000, comment: '부동산 디지털 전환 시대에 핵심 인프라가 될 것입니다.', password: 'zigbang9' },
    ],
  },
  {
    companyName: '오늘의집',
    investments: [
      { name: '류준혁', organization: 'Naver D2SF', amount: 1200000, comment: '콘텐츠와 커머스 결합 모델이 차별화됩니다.', password: 'ohouse01' },
      { name: '백수연', organization: 'IMM인베스트먼트', amount: 900000, comment: '인테리어 시장 내 데이터 자산이 강력합니다.', password: 'imm2024' },
    ],
  },
  {
    companyName: '에이슬립',
    investments: [
      { name: '황민찬', organization: 'KDB산업은행', amount: 150000, comment: '수면 헬스케어 시장의 성장 가능성에 투자합니다.', password: 'sleep77' },
    ],
  },
]

async function main() {
  console.log('🌱 Seed 시작...')

  // 기존 데이터 초기화 — 외래키 제약 때문에 Investment 먼저 삭제
  await prisma.investment.deleteMany()
  await prisma.company.deleteMany()
  console.log('🗑️  기존 데이터 삭제 완료')

  // 기업 생성
  const createdCompanies = await Promise.all(
    companies.map((company) => prisma.company.create({ data: company }))
  )
  console.log(`✅ 기업 ${createdCompanies.length}개 생성 완료`)

  // companyName → id 매핑 테이블
  const companyIdMap = Object.fromEntries(
    createdCompanies.map((c) => [c.name, c.id])
  )

  // 투자 내역 생성 — companyName을 실제 companyId로 치환
  const investmentData = investmentTemplates.flatMap(({ companyName, investments }) =>
    investments.map((inv) => ({
      ...inv,
      companyId: companyIdMap[companyName],
    }))
  )

  await prisma.investment.createMany({ data: investmentData })
  console.log(`✅ 투자 내역 ${investmentData.length}건 생성 완료`)

  console.log('🎉 Seed 완료!')
}

main()
  .catch((err) => {
    console.error('❌ Seed 실패:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
