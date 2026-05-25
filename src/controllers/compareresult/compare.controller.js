import prisma from "../../utils/prisma.js";

export const compareCompanies = async (req, res) => {
  try {
    const ids = req.params.ids.split(",").map(Number);
    const { orderBy = "revenue", sort = "desc" } = req.query;

    const dbSortableFields = ["revenue", "headCount"];
    const isDbField = dbSortableFields.includes(orderBy);

    const companies = await prisma.company.findMany({
      where: {
        id: { in: ids },
      },
      orderBy: isDbField ? { [orderBy]: sort } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        revenue: true,
        headCount: true,
        investments: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!companies) {
      return res
        .status(404)
        .json({ success: false, message: "company 찾을 수 없습니다" });
    }

    const formatted = companies.map((company) => {
      const { investments, ...rest } = company;
      return {
        ...rest,
        revenue: Number(company.revenue),
        totalAmount: investments.reduce(
          (sum, inv) => sum + Number(inv.amount),
          0,
        ),
      };
    });

    if (!isDbField && orderBy === "totalAmount") {
      formatted.sort((a, b) =>
        sort === "desc"
          ? b.totalAmount - a.totalAmount
          : a.totalAmount - b.totalAmount,
      );
    }

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
