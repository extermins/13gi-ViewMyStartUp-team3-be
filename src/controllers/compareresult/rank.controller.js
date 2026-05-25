import prisma from "../../utils/prisma.js";

export const rankCompanies = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { orderBy = "revenue", sort = "desc" } = req.query;

    const dbSortableFields = ["revenue", "headCount"];
    const isDbField = dbSortableFields.includes(orderBy);

    // 1. 전체 데이터 조회
    const all = await prisma.company.findMany({
      orderBy: isDbField ? { [orderBy]: sort } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        revenue: true,
        headCount: true,
        investments: {
          select: { amount: true },
        },
      },
    });

    // 2. totalInvestment 계산
    const withTotal = all.map((company) => ({
      ...company,
      totalInvestment: company.investments.reduce(
        (sum, inv) => sum + inv.amount,
        0n,
      ),
    }));

    // 3. rank 부여
    const sorted = [...withTotal].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (typeof aVal === "bigint") {
        if (sort === "asc") return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }

      return sort === "asc" ? aVal - bVal : bVal - aVal;
    });

    const withRank = sorted.map((company, index) => ({
      ...company,
      rank: index + 1,
    }));

    // 4. 특정 id 위치 확인
    const myIndex = withRank.findIndex((c) => c.id === id);

    if (myIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "회사를 찾을 수 없습니다." });
    }

    // 5. 슬라이싱 (항상 5개 보장)
    const total = withRank.length;

    const startIndex = (() => {
      if (myIndex === 0) return 0; // 앞에서 1위
      if (myIndex === 1) return 0; // 앞에서 2위
      if (myIndex >= total - 1) return Math.max(0, total - 5); // 뒤에서 1위
      if (myIndex >= total - 2) return Math.max(0, total - 5); // 뒤에서 2위
      return myIndex - 2; // 일반: 위2 + 나 + 아래2
    })();

    const result = withRank
      .slice(startIndex, startIndex + 5)
      .map((company) => ({
        id: company.id,
        name: company.name,
        description: company.description,
        category: company.category,
        headCount: company.headCount,
        revenue: company.revenue.toString(),
        totalInvestment: company.totalInvestment.toString(),
        rank: company.rank,
      }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
