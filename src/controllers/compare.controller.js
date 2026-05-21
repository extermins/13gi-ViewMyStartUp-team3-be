import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

// 나의 기업 비교 - 기업 목록 조회
export const getCompanies = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 5 } = req.query;
  // 검색
  const where = {};
  if (search) {
    where.OR = [{ name: { contains: search } }];
  }
  // 페이지네이션
  const pageNum = Number(page) || 1;
  const take = Number(limit) || 5;
  const skip = (pageNum - 1) * take;

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.count({ where }),
  ]);

  res.status(200).json({ data: companies, total });
});
// 나의 기업 비교 - 나의 기업 선택
export const postMypick = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "id가 숫자가 아닙니다" });
  }

  const mypick = await prisma.company.update({
    where: { id: parseInt(id) },
    select: { mypickCount: true },
    data: { mypickCount: { increment: 1 } },
  });

  res.status(200).json({ data: mypick });
});
// 나의 기업 비교 - 비교 기업 선택
export const postComparison = asyncHandler();
