// src/controllers/companies.controller.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // 프론트엔드에서 보낸 query를 읽어옵니다
    const keyword = req.query.keyword || "";
    const sort = req.query.sort || "";

    // 1단계: 검색어(keyword)가 있으면 필터링해서 가져옵니다
    const where = keyword ? { name: { contains: keyword } } : {};
    const companies = await prisma.company.findMany({
      where,
      include: {
        investments: true,
      },
    });

    // 2단계: 가져온 모든 기업의 투자금(actualInvestment) 계산하기
    let formattedCompanies = companies.map((company) => {
      const totalInvestment = (company.investments || []).reduce((sum, inv) => {
        return sum + inv.amount;
      }, 0n);

      const { investments, ...rest } = company;
      return {
        ...rest,
        actualInvestment: totalInvestment,
      };
    });

    // 3단계: 자바스크립트의 정렬(Sort) 기능으로 줄 세우기
    if (sort) {
      formattedCompanies.sort((a, b) => {
        // 프론트엔드에서 보낸 정확한 암호를 해독해서 정렬
        if (sort === "investment_desc")
          return a.actualInvestment < b.actualInvestment ? 1 : -1; // 투자금 높은순
        if (sort === "investment_asc")
          return a.actualInvestment > b.actualInvestment ? 1 : -1; // 투자금 낮은순

        if (sort === "revenue_desc") return a.revenue < b.revenue ? 1 : -1; // 매출액 높은순
        if (sort === "revenue_asc") return a.revenue > b.revenue ? 1 : -1; // 매출액 낮은순

        if (sort === "employees_desc")
          return a.headCount < b.headCount ? 1 : -1; // 고용 인원 많은순
        if (sort === "employees_asc") return a.headCount > b.headCount ? 1 : -1; // 고용 인원 적은순

        return 0;
      });
    } else {
      // 정렬 조건이 없을 때의 기본값: 누적 투자금액 높은 순
      formattedCompanies.sort((a, b) =>
        a.actualInvestment < b.actualInvestment ? 1 : -1,
      );
    }

    // 4단계: 줄 선 데이터를 페이지 번호에 맞게 자르기
    const totalCount = formattedCompanies.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const skip = (page - 1) * pageSize;

    // 현재 페이지 번호부터 10개만 잘라서 프론트엔드로 보냅니다
    const paginatedCompanies = formattedCompanies.slice(skip, skip + pageSize);

    res.json({
      success: true,
      data: paginatedCompanies,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("기업 목록 조회 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버에서 데이터를 가져오지 못했습니다.",
    });
  }
};
