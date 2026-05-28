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

    // 데이터 가공 (리뷰 피드백 반영: reduce를 활용해 organization 필드 기준으로 합산)
    const processedCompanies = allCompanies.map((company) => {
      // company.investments 배열을 reduce로 누적 계산
      const investmentTotals = company.investments.reduce(
        (acc, inv) => {
          const amount = Number(inv.amount);

          if (inv.organization === "mystartup") {
            acc.simulated += amount; // mystartup이면 simulated 누적 금액에 더함
          } else if (inv.organization === "other") {
            acc.actual += amount; // other이면 actual 누적 금액에 더함
          }
          return acc; // 계산된 누적 객체를 다음 루프로 전달
        },
        { actual: 0, simulated: 0 }, // 누적을 시작할 초기 객체 값
      );

      // 응답에서 무거운 investments 배열은 제외하고 계산된 금액 필드 추가
      const { investments, ...companyData } = company;

      return {
        ...companyData,
        simulatedInvestment: investmentTotals.simulated,
        actualInvestment: investmentTotals.actual,
      };
    });

    // 조건에 맞춰 정렬 진행 (actual 또는 simulated)
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
