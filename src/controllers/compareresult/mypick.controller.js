import prisma from "../../utils/prisma.js";

export const getTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "유효하지 않은 id입니다" });
    }

    const company = await prisma.company.findUnique({
      where: { id },
      select: { id: true, name: true, imageUrl: true },
    });

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "company 찾을 수 없습니다" });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
