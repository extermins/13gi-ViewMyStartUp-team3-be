import express from "express";
import db from "../utils/prisma.js";

const router = express.Router();

// BigInt를 Number로 변환하는 함수
const serializeCompanyData = (data) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
};

// 투자 기업 목록 조회 API
router.get("/api/investcompanies", async (req, res) => {
  try {
    // 쿼리 스트링 파싱 및 안전장치
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);

    // 프론트엔드 입력값 따옴표 제거 안전장치
    const rawOrderBy = req.query.orderBy
      ? req.query.orderBy.replace(/"/g, "")
      : "simulated";
    const sort = req.query.sort ? req.query.sort.replace(/"/g, "") : "desc";

    // DB에서 모든 회사 정보와 누적 투자 금액 계산을 위한 데이터 조회
    const allCompanies = await db.company.findMany({
      include: {
        investments: true,
      },
    });

    // 데이터 가공 (실제 투자금액 및 가상 투자금액 계산) Mock 데이터
    const processedCompanies = allCompanies.map((company) => {
      // 실제 DB에 investment가 없으므로, 임시로 회사의 고유 ID나 매출액을 활용해 가짜 투자금을 만듦
      // 예시: 회사 ID * 10억 원을 실제 투자금으로 가정
      const actualInvestment =
        company.investments.length > 0
          ? company.investments.reduce(
              (sum, inv) => sum + Number(inv.amount),

              0,
            )
          : company.id * 1000000000; // DB가 비어있을 때 작동하는 가짜 데이터

      // View My Startup 투자 금액 (테스트를 위해 실제 투자 금액의 80%로 세팅)
      const simulatedInvestment = Math.floor(actualInvestment * 0.8);

      // 응답에서 무거운 investments 배열은 제외하고 계산된 금액 필드 추가
      const { investments, ...companyData } = company;

      return {
        ...companyData,
        simulatedInvestment,
        actualInvestment,
      };
    });

    // 지정된 조건에 맞춰 정렬 진행 (actual 또는 simulated)
    // - simulated: View My Startup 투자 금액
    // - actual: 실제 누적 투자 금액
    const sortKey =
      rawOrderBy === "actual" ? "actualInvestment" : "simulatedInvestment";

    processedCompanies.sort((a, b) => {
      if (sort === "asc") {
        return a[sortKey] - b[sortKey]; // 낮은 순 (오름차순)
      } else {
        return b[sortKey] - a[sortKey]; // 높은 순 (내림차순 - 기본값)
      }
    });

    // 정렬된 결과에서 페이지네이션 쪼개기 (Slice)
    const totalCount = processedCompanies.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedCompanies = processedCompanies.slice(
      startIndex,
      startIndex + pageSize,
    );

    // BigInt를 안전하게 변환하여 응답 반환
    const responseData = serializeCompanyData({
      success: true,
      data: paginatedCompanies,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });

    res.json(responseData);
  } catch (error) {
    console.error("투자 기업 목록 조회 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 에러가 발생했습니다." });
  }
});

export default router;
