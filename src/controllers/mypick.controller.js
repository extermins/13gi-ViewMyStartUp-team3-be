import prisma from "../utils/prisma.js";

export default {
  // 나의 기업 비교 - 기업 목록 조회
  GetCompanies: async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({ message: "서버 오류 발생" });
    }
  },

  // 나의 기업 비교 - 나의 기업 선택
  PatchMypick: async (req, res) => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return res.status(400).json({ message: "id가 숫자가 아닙니다" });
      }

      const mypick = await prisma.company.update({
        where: { id: parsedId },
        select: { mypickCount: true },
        data: { mypickCount: { increment: 1 } },
      });

      res.status(200).json({ data: mypick });
    } catch (error) {
      res.status(500).json({ message: "서버 오류 발생" });
    }
  },

  // 나의 기업 비교 - 비교 기업 선택
  PatchComparison: async (req, res) => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return res.status(400).json({ message: "id가 숫자가 아닙니다" });
      }

      const comparison = await prisma.company.update({
        where: { id: parsedId },
        select: { comparisonCount: true },
        data: { comparisonCount: { increment: 1 } },
      });

      res.status(200).json({ data: comparison });
    } catch (error) {
      res.status(500).json({ message: "서버 오류 발생" });
    }
  },
};
