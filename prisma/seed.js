import prisma from "../src/utils/prisma.js";

// const prisma = new PrismaClient();

const companies = [
  {
    name: "네이버클라우드",
    description:
      "국내 최대 포털 네이버의 클라우드 서비스 부문으로, 기업용 클라우드 인프라와 AI 솔루션을 제공합니다.",
    headCount: 850,
    category: "SaaS/클라우드",
    revenue: 125000000000,
    mypickCount: 2341,
    comparisonCount: 5672,
  },
  {
    name: "카카오모빌리티",
    description:
      "카카오택시, 대리운전, 주차 서비스 등 다양한 모빌리티 플랫폼을 운영하는 기업입니다.",
    headCount: 620,
    category: "모빌리티",
    revenue: 98000000000,
    mypickCount: 3102,
    comparisonCount: 6891,
  },
  {
    name: "토스뱅크",
    description:
      "모바일 중심의 인터넷 전문 은행으로 간편하고 혁신적인 금융 서비스를 제공합니다.",
    headCount: 430,
    category: "핀테크",
    revenue: 210000000000,
    mypickCount: 4521,
    comparisonCount: 9234,
  },
  {
    name: "무신사",
    description:
      "패션 커머스 플랫폼으로 국내외 다양한 브랜드와 독립 디자이너 제품을 판매합니다.",
    headCount: 780,
    category: "이커머스",
    revenue: 342000000000,
    mypickCount: 5671,
    comparisonCount: 11230,
  },
  {
    name: "당근마켓",
    description:
      "지역 기반 중고거래 플랫폼으로 동네 이웃 간의 따뜻한 거래 문화를 만들어 갑니다.",
    headCount: 390,
    category: "이커머스",
    revenue: 45000000000,
    mypickCount: 6234,
    comparisonCount: 13401,
  },
  {
    name: "크래프톤",
    description:
      "배틀그라운드 개발사로 글로벌 게임 시장에서 독보적인 위치를 차지하는 게임 기업입니다.",
    headCount: 3200,
    category: "게임/엔터테인먼트",
    revenue: 1890000000000,
    mypickCount: 7823,
    comparisonCount: 15672,
  },
  {
    name: "에이블리",
    description:
      "AI 기반 패션 추천 서비스를 제공하는 여성 패션 커머스 플랫폼입니다.",
    headCount: 280,
    category: "이커머스",
    revenue: 67000000000,
    mypickCount: 2134,
    comparisonCount: 4567,
  },
  {
    name: "리디북스",
    description:
      "전자책, 웹툰, 웹소설 등 다양한 디지털 콘텐츠를 제공하는 콘텐츠 플랫폼입니다.",
    headCount: 320,
    category: "게임/엔터테인먼트",
    revenue: 89000000000,
    mypickCount: 1893,
    comparisonCount: 4012,
  },
  {
    name: "마켓컬리",
    description:
      "신선식품 새벽배송 서비스를 선도하는 프리미엄 식품 이커머스 기업입니다.",
    headCount: 1200,
    category: "식품/농업",
    revenue: 456000000000,
    mypickCount: 4321,
    comparisonCount: 9876,
  },
  {
    name: "직방",
    description:
      "부동산 정보 플랫폼으로 아파트, 원룸, 오피스텔 등 다양한 주거 정보를 제공합니다.",
    headCount: 450,
    category: "프롭테크",
    revenue: 78000000000,
    mypickCount: 2876,
    comparisonCount: 6234,
  },
  {
    name: "뱅크샐러드",
    description:
      "개인 자산 관리 앱으로 금융 데이터를 분석해 맞춤형 재무 솔루션을 제공합니다.",
    headCount: 180,
    category: "핀테크",
    revenue: 23000000000,
    mypickCount: 1543,
    comparisonCount: 3421,
  },
  {
    name: "오늘의집",
    description:
      "인테리어 정보와 가구, 소품을 함께 구매할 수 있는 라이프스타일 커머스 플랫폼입니다.",
    headCount: 560,
    category: "이커머스",
    revenue: 234000000000,
    mypickCount: 5432,
    comparisonCount: 11234,
  },
  {
    name: "야놀자",
    description:
      "숙박, 레저, 여행 등 다양한 여가 서비스를 제공하는 글로벌 여행 플랫폼 기업입니다.",
    headCount: 1800,
    category: "여행/레저",
    revenue: 567000000000,
    mypickCount: 6543,
    comparisonCount: 14567,
  },
  {
    name: "클래스101",
    description:
      "취미, 커리어, 자기계발 등 다양한 분야의 온라인 클래스를 제공하는 교육 플랫폼입니다.",
    headCount: 230,
    category: "교육",
    revenue: 34000000000,
    mypickCount: 1234,
    comparisonCount: 2876,
  },
  {
    name: "왓챠",
    description:
      "영화, 드라마, 애니메이션 등 다양한 콘텐츠를 스트리밍하는 OTT 플랫폼입니다.",
    headCount: 290,
    category: "게임/엔터테인먼트",
    revenue: 56000000000,
    mypickCount: 2345,
    comparisonCount: 5678,
  },
  {
    name: "메디블록",
    description:
      "블록체인 기반 의료 데이터 관리 플랫폼으로 환자 중심의 의료 생태계를 구축합니다.",
    headCount: 95,
    category: "바이오/헬스케어",
    revenue: 12000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "버킷플레이스",
    description:
      "오늘의집 운영사로 홈 인테리어 커뮤니티와 커머스를 결합한 플랫폼을 운영합니다.",
    headCount: 480,
    category: "이커머스",
    revenue: 198000000000,
    mypickCount: 3456,
    comparisonCount: 7654,
  },
  {
    name: "에이치디정공",
    description:
      "스마트 팩토리 솔루션과 산업용 IoT 기기를 개발하는 제조 혁신 기업입니다.",
    headCount: 340,
    category: "제조/IoT",
    revenue: 145000000000,
    mypickCount: 987,
    comparisonCount: 2134,
  },
  {
    name: "스타일쉐어",
    description:
      "패션 SNS와 커머스를 결합한 플랫폼으로 10-20대 여성 패션 트렌드를 선도합니다.",
    headCount: 145,
    category: "이커머스",
    revenue: 28000000000,
    mypickCount: 1876,
    comparisonCount: 4123,
  },
  {
    name: "그린랩스",
    description:
      "농업 데이터 분석과 스마트팜 솔루션을 제공하는 애그테크 스타트업입니다.",
    headCount: 120,
    category: "식품/농업",
    revenue: 18000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "플렉스",
    description:
      "HR SaaS 플랫폼으로 급여, 인사관리, 전자계약 등 기업 인사 업무를 자동화합니다.",
    headCount: 160,
    category: "SaaS/클라우드",
    revenue: 25000000000,
    mypickCount: 1123,
    comparisonCount: 2543,
  },
  {
    name: "센드버드",
    description:
      "앱 내 채팅, 영상통화, AI 챗봇 기능을 API로 제공하는 글로벌 커뮤니케이션 플랫폼입니다.",
    headCount: 280,
    category: "SaaS/클라우드",
    revenue: 89000000000,
    mypickCount: 1654,
    comparisonCount: 3876,
  },
  {
    name: "스캐터랩",
    description:
      "AI 감성 대화 엔진 기술을 보유하고 연애의 과학, 루다 등의 서비스를 운영합니다.",
    headCount: 85,
    category: "AI/빅데이터",
    revenue: 9800000000,
    mypickCount: 987,
    comparisonCount: 2234,
  },
  {
    name: "몰로코",
    description:
      "머신러닝 기반 광고 플랫폼으로 글로벌 디지털 광고 시장에서 성장하는 애드테크 기업입니다.",
    headCount: 350,
    category: "AI/빅데이터",
    revenue: 234000000000,
    mypickCount: 2341,
    comparisonCount: 5432,
  },
  {
    name: "두나무",
    description:
      "업비트 운영사로 국내 최대 가상자산 거래소를 운영하는 블록체인 금융 기업입니다.",
    headCount: 720,
    category: "핀테크",
    revenue: 3450000000000,
    mypickCount: 8765,
    comparisonCount: 19234,
  },
  {
    name: "딜리버리히어로코리아",
    description:
      "요기요 운영사로 음식 배달 플랫폼 서비스를 제공하는 푸드테크 기업입니다.",
    headCount: 540,
    category: "식품/농업",
    revenue: 345000000000,
    mypickCount: 4567,
    comparisonCount: 10234,
  },
  {
    name: "에듀윌",
    description:
      "공무원, 자격증 등 취업 교육 콘텐츠와 온오프라인 강의를 제공하는 교육 기업입니다.",
    headCount: 890,
    category: "교육",
    revenue: 234000000000,
    mypickCount: 2134,
    comparisonCount: 4876,
  },
  {
    name: "클로봇",
    description:
      "실내 자율주행 로봇을 개발하고 서비스 로봇 솔루션을 제공하는 로보틱스 스타트업입니다.",
    headCount: 75,
    category: "로보틱스",
    revenue: 8700000000,
    mypickCount: 765,
    comparisonCount: 1654,
  },
  {
    name: "엔씨소프트",
    description:
      "리니지, 블레이드앤소울 등 MMORPG 게임을 개발하는 국내 대표 게임 기업입니다.",
    headCount: 4500,
    category: "게임/엔터테인먼트",
    revenue: 1670000000000,
    mypickCount: 9234,
    comparisonCount: 21456,
  },
  {
    name: "카카오페이",
    description:
      "간편결제, 송금, 보험, 투자 등 종합 금융 서비스를 제공하는 핀테크 기업입니다.",
    headCount: 980,
    category: "핀테크",
    revenue: 567000000000,
    mypickCount: 7654,
    comparisonCount: 17234,
  },
  {
    name: "이스트소프트",
    description:
      "알집, 알PDF 등 소프트웨어와 AI 기반 보안 솔루션을 개발하는 IT 기업입니다.",
    headCount: 420,
    category: "SaaS/클라우드",
    revenue: 89000000000,
    mypickCount: 1234,
    comparisonCount: 2876,
  },
  {
    name: "모비데이즈",
    description:
      "디지털 마케팅 자동화 플랫폼과 퍼포먼스 마케팅 솔루션을 제공하는 애드테크 기업입니다.",
    headCount: 210,
    category: "AI/빅데이터",
    revenue: 45000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "파수닷컴",
    description:
      "기업 데이터 보안 솔루션과 문서 암호화, DRM 기술을 제공하는 사이버보안 기업입니다.",
    headCount: 380,
    category: "SaaS/클라우드",
    revenue: 67000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "아이지에이웍스",
    description:
      "모바일 광고 플랫폼과 앱 분석 솔루션을 제공하는 데이터 마케팅 기업입니다.",
    headCount: 190,
    category: "AI/빅데이터",
    revenue: 34000000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "리멤버",
    description:
      "명함 관리 앱에서 출발해 비즈니스 네트워크 플랫폼으로 성장한 커리어 서비스 기업입니다.",
    headCount: 240,
    category: "SaaS/클라우드",
    revenue: 38000000000,
    mypickCount: 1432,
    comparisonCount: 3234,
  },
  {
    name: "팀스파르타",
    description:
      "코딩 부트캠프와 IT 교육 서비스를 제공하는 개발자 양성 전문 교육 기업입니다.",
    headCount: 175,
    category: "교육",
    revenue: 22000000000,
    mypickCount: 1876,
    comparisonCount: 4123,
  },
  {
    name: "원티드랩",
    description:
      "AI 기반 채용 매칭 플랫폼으로 구직자와 기업을 연결하는 HR테크 기업입니다.",
    headCount: 310,
    category: "SaaS/클라우드",
    revenue: 56000000000,
    mypickCount: 2345,
    comparisonCount: 5432,
  },
  {
    name: "아이지넷",
    description:
      "보험 비교, 추천 플랫폼으로 소비자 맞춤형 보험 상품을 연결하는 인슈어테크 기업입니다.",
    headCount: 130,
    category: "핀테크",
    revenue: 17000000000,
    mypickCount: 765,
    comparisonCount: 1654,
  },
  {
    name: "비바리퍼블리카",
    description:
      "토스 운영사로 금융 슈퍼앱을 통해 다양한 금융 서비스를 통합 제공하는 핀테크 기업입니다.",
    headCount: 2300,
    category: "핀테크",
    revenue: 890000000000,
    mypickCount: 12345,
    comparisonCount: 27654,
  },
  {
    name: "컬리",
    description:
      "프리미엄 식품 새벽배송 서비스 마켓컬리를 운영하는 식품 이커머스 기업입니다.",
    headCount: 1350,
    category: "식품/농업",
    revenue: 512000000000,
    mypickCount: 5432,
    comparisonCount: 12234,
  },
  {
    name: "에이팀벤처스",
    description:
      "제조 기업을 위한 제조 협업 플랫폼 및 스마트 제조 솔루션을 제공하는 기업입니다.",
    headCount: 95,
    category: "제조/IoT",
    revenue: 12000000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "게임덕",
    description:
      "게임 아이템 거래 및 게임 커뮤니티 서비스를 운영하는 게임 플랫폼 기업입니다.",
    headCount: 65,
    category: "게임/엔터테인먼트",
    revenue: 7800000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "세탁특공대",
    description:
      "모바일 앱 기반 세탁 픽업 및 배달 서비스를 제공하는 O2O 생활 서비스 기업입니다.",
    headCount: 145,
    category: "O2O서비스",
    revenue: 19000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "숨고",
    description:
      "전문가 매칭 플랫폼으로 다양한 분야의 전문가와 고객을 연결하는 서비스 기업입니다.",
    headCount: 180,
    category: "O2O서비스",
    revenue: 28000000000,
    mypickCount: 987,
    comparisonCount: 2234,
  },
  {
    name: "탈잉",
    description:
      "재능 공유 플랫폼으로 다양한 분야의 튜터와 학습자를 연결하는 교육 기업입니다.",
    headCount: 85,
    category: "교육",
    revenue: 9500000000,
    mypickCount: 765,
    comparisonCount: 1654,
  },
  {
    name: "스타일리스트",
    description:
      "AI 기반 패션 스타일링 서비스와 개인화 쇼핑 경험을 제공하는 패션테크 기업입니다.",
    headCount: 70,
    category: "이커머스",
    revenue: 6700000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "룩핀",
    description:
      "남성 패션 커머스 플랫폼으로 스타일 추천과 쇼핑을 결합한 서비스를 제공합니다.",
    headCount: 60,
    category: "이커머스",
    revenue: 5400000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "버즈빌",
    description:
      "잠금화면 광고 플랫폼과 리워드 광고 솔루션을 글로벌 시장에 제공하는 애드테크 기업입니다.",
    headCount: 165,
    category: "AI/빅데이터",
    revenue: 34000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "핀다",
    description:
      "금융 상품 비교 플랫폼으로 대출, 카드, 저축 상품을 비교 추천하는 핀테크 기업입니다.",
    headCount: 140,
    category: "핀테크",
    revenue: 21000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "빌리지베이비",
    description:
      "임산부와 영유아 부모를 위한 육아 정보, 제품 커머스 플랫폼을 운영하는 기업입니다.",
    headCount: 55,
    category: "이커머스",
    revenue: 4300000000,
    mypickCount: 321,
    comparisonCount: 765,
  },
  {
    name: "닥터나우",
    description:
      "비대면 의료 상담 및 처방 서비스를 제공하는 디지털 헬스케어 플랫폼 기업입니다.",
    headCount: 110,
    category: "바이오/헬스케어",
    revenue: 15000000000,
    mypickCount: 1234,
    comparisonCount: 2876,
  },
  {
    name: "굿닥",
    description:
      "병원 예약 및 의료 정보 플랫폼으로 환자와 의료기관을 연결하는 헬스케어 기업입니다.",
    headCount: 130,
    category: "바이오/헬스케어",
    revenue: 18000000000,
    mypickCount: 987,
    comparisonCount: 2234,
  },
  {
    name: "캐시슬라이드",
    description:
      "잠금화면 광고 리워드 앱으로 사용자에게 포인트를 지급하는 리워드 플랫폼 기업입니다.",
    headCount: 90,
    category: "AI/빅데이터",
    revenue: 11000000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "채널코퍼레이션",
    description:
      "기업용 고객 커뮤니케이션 플랫폼 채널톡을 운영하는 SaaS 기업입니다.",
    headCount: 320,
    category: "SaaS/클라우드",
    revenue: 67000000000,
    mypickCount: 1543,
    comparisonCount: 3456,
  },
  {
    name: "트레바리",
    description:
      "독서 모임 플랫폼으로 책과 사람을 연결하는 지식 커뮤니티 서비스를 운영합니다.",
    headCount: 45,
    category: "교육",
    revenue: 3200000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "밀리의서재",
    description:
      "전자책 무제한 구독 서비스를 제공하는 디지털 독서 플랫폼 기업입니다.",
    headCount: 175,
    category: "게임/엔터테인먼트",
    revenue: 45000000000,
    mypickCount: 2134,
    comparisonCount: 4876,
  },
  {
    name: "오픈서베이",
    description:
      "모바일 설문조사 플랫폼으로 기업 시장조사와 소비자 인사이트를 제공하는 기업입니다.",
    headCount: 120,
    category: "AI/빅데이터",
    revenue: 17000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "스마트스터디",
    description:
      "핑크퐁 운영사로 유아동 교육 콘텐츠와 글로벌 IP 사업을 영위하는 에듀테크 기업입니다.",
    headCount: 560,
    category: "교육",
    revenue: 234000000000,
    mypickCount: 4321,
    comparisonCount: 9876,
  },
  {
    name: "레인보우브레인",
    description:
      "AI 기반 로보틱스 솔루션과 지능형 자동화 시스템을 개발하는 스타트업입니다.",
    headCount: 65,
    category: "로보틱스",
    revenue: 7800000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "바로고",
    description:
      "라스트마일 배송 솔루션과 퀵커머스 물류 인프라를 제공하는 물류 테크 기업입니다.",
    headCount: 280,
    category: "물류",
    revenue: 56000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "두들링크",
    description:
      "공공기관과 기업을 위한 전자문서 솔루션과 행정 자동화 플랫폼을 제공합니다.",
    headCount: 95,
    category: "SaaS/클라우드",
    revenue: 13000000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "심플키친",
    description:
      "가정간편식(HMR) 제품 개발과 건강식 구독 서비스를 제공하는 푸드테크 기업입니다.",
    headCount: 75,
    category: "식품/농업",
    revenue: 9800000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "엑셀세라퓨틱스",
    description:
      "세포치료제와 유전자 편집 기술을 연구하는 차세대 바이오 신약 개발 기업입니다.",
    headCount: 85,
    category: "바이오/헬스케어",
    revenue: 11000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "메가존클라우드",
    description:
      "AWS 파트너사로 클라우드 전환 컨설팅과 매니지드 서비스를 제공하는 클라우드 전문 기업입니다.",
    headCount: 1200,
    category: "SaaS/클라우드",
    revenue: 345000000000,
    mypickCount: 2345,
    comparisonCount: 5432,
  },
  {
    name: "넛지헬스케어",
    description:
      "캐시워크 앱을 통해 걷기 리워드와 건강 관리 서비스를 제공하는 헬스케어 기업입니다.",
    headCount: 95,
    category: "바이오/헬스케어",
    revenue: 14000000000,
    mypickCount: 1234,
    comparisonCount: 2876,
  },
  {
    name: "웨이브",
    description:
      "KBS, MBC, SBS 등 주요 방송사가 참여한 OTT 플랫폼으로 국내 콘텐츠를 스트리밍합니다.",
    headCount: 340,
    category: "게임/엔터테인먼트",
    revenue: 123000000000,
    mypickCount: 3456,
    comparisonCount: 7654,
  },
  {
    name: "제이오",
    description:
      "수소 생산과 저장 기술을 개발하는 친환경 수소 에너지 솔루션 스타트업입니다.",
    headCount: 55,
    category: "에너지/환경",
    revenue: 4500000000,
    mypickCount: 321,
    comparisonCount: 765,
  },
  {
    name: "모아데이터",
    description:
      "통신사 데이터를 활용한 인구 이동 분석과 상권 분석 솔루션을 제공하는 빅데이터 기업입니다.",
    headCount: 80,
    category: "AI/빅데이터",
    revenue: 9800000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "지란지교시큐리티",
    description:
      "이메일 보안, 망분리, 내부정보 유출 방지 등 사이버 보안 솔루션을 제공하는 기업입니다.",
    headCount: 280,
    category: "SaaS/클라우드",
    revenue: 45000000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "콴다",
    description:
      "AI 기반 수학 문제 풀이 앱으로 글로벌 10대 학생들에게 학습 지원 서비스를 제공합니다.",
    headCount: 210,
    category: "교육",
    revenue: 38000000000,
    mypickCount: 2876,
    comparisonCount: 6543,
  },
  {
    name: "펄어비스",
    description:
      "검은사막 개발사로 글로벌 MMORPG 게임을 서비스하는 게임 개발 기업입니다.",
    headCount: 1800,
    category: "게임/엔터테인먼트",
    revenue: 456000000000,
    mypickCount: 6543,
    comparisonCount: 14567,
  },
  {
    name: "아이디어스",
    description:
      "핸드메이드 작가와 소비자를 연결하는 수공예 커머스 플랫폼 기업입니다.",
    headCount: 120,
    category: "이커머스",
    revenue: 23000000000,
    mypickCount: 1234,
    comparisonCount: 2876,
  },
  {
    name: "로앤컴퍼니",
    description:
      "법률 정보 플랫폼 로톡을 운영하며 법률 서비스 접근성을 높이는 리걸테크 기업입니다.",
    headCount: 145,
    category: "SaaS/클라우드",
    revenue: 19000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "트위니",
    description:
      "자율주행 배송 로봇을 개발하고 실내외 물류 자동화 솔루션을 제공하는 로보틱스 기업입니다.",
    headCount: 70,
    category: "로보틱스",
    revenue: 8900000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "수아랩",
    description:
      "딥러닝 기반 머신 비전 검사 솔루션으로 제조업 품질 검사를 자동화하는 AI 기업입니다.",
    headCount: 90,
    category: "AI/빅데이터",
    revenue: 12000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "솔트룩스",
    description:
      "자연어처리 AI 기술로 기업용 지식관리, 챗봇, 검색 솔루션을 제공하는 AI 기업입니다.",
    headCount: 180,
    category: "AI/빅데이터",
    revenue: 34000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "이스트에그",
    description:
      "소셜 게임과 캐주얼 모바일 게임을 개발하는 인디 게임 스튜디오입니다.",
    headCount: 40,
    category: "게임/엔터테인먼트",
    revenue: 3200000000,
    mypickCount: 321,
    comparisonCount: 765,
  },
  {
    name: "헬스커넥트",
    description:
      "웨어러블 기기 데이터를 분석해 맞춤형 건강 관리 솔루션을 제공하는 디지털 헬스케어 기업입니다.",
    headCount: 75,
    category: "바이오/헬스케어",
    revenue: 9800000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "패스트파이브",
    description:
      "공유오피스 브랜드로 도심 핵심 지역에 프리미엄 업무 공간을 제공하는 프롭테크 기업입니다.",
    headCount: 320,
    category: "프롭테크",
    revenue: 78000000000,
    mypickCount: 1234,
    comparisonCount: 2876,
  },
  {
    name: "스페이스클라우드",
    description:
      "공간 대여 플랫폼으로 파티룸, 스튜디오, 모임 공간 등을 연결하는 O2O 서비스 기업입니다.",
    headCount: 85,
    category: "O2O서비스",
    revenue: 11000000000,
    mypickCount: 765,
    comparisonCount: 1654,
  },
  {
    name: "엠씨넥스",
    description:
      "스마트폰 카메라 모듈과 차량용 카메라 솔루션을 개발하는 광학 부품 기업입니다.",
    headCount: 1200,
    category: "제조/IoT",
    revenue: 456000000000,
    mypickCount: 987,
    comparisonCount: 2234,
  },
  {
    name: "링크샵스",
    description:
      "소상공인을 위한 온라인 쇼핑몰 개설과 디지털 마케팅 솔루션을 제공하는 기업입니다.",
    headCount: 65,
    category: "SaaS/클라우드",
    revenue: 7800000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "닷슬래시대시",
    description:
      "개발자 커뮤니티와 기술 콘텐츠 플랫폼을 운영하며 IT 인재 채용 서비스를 제공합니다.",
    headCount: 50,
    category: "SaaS/클라우드",
    revenue: 4500000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "인크로스",
    description:
      "디지털 미디어렙 사업과 데이터 기반 광고 솔루션을 제공하는 디지털 마케팅 기업입니다.",
    headCount: 230,
    category: "AI/빅데이터",
    revenue: 67000000000,
    mypickCount: 765,
    comparisonCount: 1654,
  },
  {
    name: "브레인커머스",
    description:
      "AI 기반 상품 추천 엔진과 개인화 쇼핑 경험을 이커머스 기업에 제공하는 SaaS 기업입니다.",
    headCount: 55,
    category: "AI/빅데이터",
    revenue: 5600000000,
    mypickCount: 321,
    comparisonCount: 765,
  },
  {
    name: "알체라",
    description:
      "얼굴인식, 이상행동 탐지 등 영상 AI 솔루션을 공항, 금융, 유통 분야에 제공하는 기업입니다.",
    headCount: 95,
    category: "AI/빅데이터",
    revenue: 13000000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "에이아이스페라",
    description:
      "사이버 위협 인텔리전스 플랫폼으로 기업의 사이버 보안 위험을 실시간 탐지합니다.",
    headCount: 60,
    category: "SaaS/클라우드",
    revenue: 7200000000,
    mypickCount: 432,
    comparisonCount: 987,
  },
  {
    name: "그린카",
    description:
      "카셰어링 서비스를 운영하며 전기차 공유 플랫폼으로 전환 중인 모빌리티 기업입니다.",
    headCount: 210,
    category: "모빌리티",
    revenue: 45000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "모션투에이아이",
    description:
      "물류 로봇과 AI 기반 창고 자동화 솔루션을 개발하는 스마트 물류 기업입니다.",
    headCount: 80,
    category: "로보틱스",
    revenue: 9800000000,
    mypickCount: 543,
    comparisonCount: 1234,
  },
  {
    name: "파킹클라우드",
    description:
      "AI 카메라와 데이터 분석 기반의 스마트 주차 관리 시스템을 제공하는 모빌리티 기업입니다.",
    headCount: 120,
    category: "모빌리티",
    revenue: 17000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "레이니스트",
    description:
      "개인 자산관리 앱 뱅크샐러드의 초기 운영사로 금융 데이터 기반 서비스를 제공합니다.",
    headCount: 160,
    category: "핀테크",
    revenue: 23000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
  {
    name: "크리에이터링크",
    description:
      "코딩 없이 웹사이트와 쇼핑몰을 제작할 수 있는 노코드 빌더 플랫폼을 제공합니다.",
    headCount: 45,
    category: "SaaS/클라우드",
    revenue: 3800000000,
    mypickCount: 321,
    comparisonCount: 765,
  },
  {
    name: "에이블엔씨",
    description:
      "에이블리 운영사로 AI 패션 추천과 여성 패션 커머스 서비스를 글로벌로 확장하고 있습니다.",
    headCount: 310,
    category: "이커머스",
    revenue: 78000000000,
    mypickCount: 2345,
    comparisonCount: 5432,
  },
  {
    name: "위드이노베이션",
    description:
      "숙박 예약 플랫폼 여기어때를 운영하며 국내 여행 숙박 시장을 선도하는 기업입니다.",
    headCount: 680,
    category: "여행/레저",
    revenue: 234000000000,
    mypickCount: 5432,
    comparisonCount: 12234,
  },
  {
    name: "아이엠티",
    description:
      "반도체 검사 장비와 디스플레이 테스트 솔루션을 개발하는 첨단 장비 제조 기업입니다.",
    headCount: 230,
    category: "제조/IoT",
    revenue: 89000000000,
    mypickCount: 654,
    comparisonCount: 1432,
  },
  {
    name: "에스오에스랩",
    description:
      "자율주행용 라이다 센서를 개발하는 자율주행 핵심 부품 전문 스타트업입니다.",
    headCount: 75,
    category: "모빌리티",
    revenue: 9800000000,
    mypickCount: 765,
    comparisonCount: 1654,
  },
  {
    name: "마인즈랩",
    description:
      "기업용 AI 플랫폼과 음성인식, 챗봇, 텍스트 분석 솔루션을 제공하는 AI 전문 기업입니다.",
    headCount: 145,
    category: "AI/빅데이터",
    revenue: 23000000000,
    mypickCount: 876,
    comparisonCount: 1987,
  },
];

async function main() {
  console.log("Seeding started...");

  for (const company of companies) {
    await prisma.company.create({
      data: company,
    });
  }

  console.log(`Seeding completed! ${companies.length} companies created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
