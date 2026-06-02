import prisma from "../../utils/prisma.js";

export const createInvestment = async (req, res) => {
  const { companyId, name, amount, comment, password, organization } = req.body;

  try {
    const investment = await prisma.investment.create({
      data: {
        companyId: Number(companyId),
        name,
        amount: Number(amount),
        comment,
        password,
        organization,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...investment,
        amount: investment.amount.toString(),
      },
    });
  } catch (error) {
    console.error("에러:", error); // 여기 메시지 확인
    res.status(500).json({ success: false, message: error.message });
  }
};
