import prisma from "../utils/prisma.js";

export default {
  //기업 상세 조회
  GetCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const companyId = Number(id);
      const companyInfo = await prisma.company.findUnique({
        where: { id: companyId },
      });

      const totalAmountInfo = await prisma.investment.aggregate({
        where: { companyId: companyId },
        _sum: {
          amount: true,
        },
      });

      if (!companyInfo) {
        return res.status(404).json({ message: "데이터가 없습니다." });
      }

      //합산한 정보를 갖고있는 _sum과 amount값이 null이 아니면 값을 넣는다. 아니라면 초기화한 값 0
      let totalAmount = 0;
      if (totalAmountInfo._sum && totalAmountInfo._sum.amount) {
        totalAmount = totalAmountInfo._sum.amount;
      }

      const companyData = BigIntToString(companyInfo);
      return res
        .status(200)
        .json({ ...companyData, totalAmount: String(totalAmount) });
    } catch (error) {
      console.error("콘솔 로그 에러 내용:", error);
      return res.status(500).json({ message: "에러가 발생했습니다." });
    }
  },
  //기업 투자 정보조회
  GetInvestment: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, pageSize = 10 } = req.query; //아무런 값이 안들어올 수도 있으니 기본 값 설정.

      const companyId = Number(id);
      const take = Number(pageSize);
      const skipPage = (Number(page) - 1) * take;

      const investmentInfo = await prisma.investment.findMany({
        where: { companyId: companyId },
        orderBy: {
          amount: "desc",
        },
        skip: skipPage,
        take: take,
      });

      if (
        investmentInfo.length === 0
      ) //0 이면 해당기업에 투자한 투자자가 없다. 투자한 정보가 없는 거기때문에 여기서 성공으로 보내준다.
      //프론트에서 아직 아무도 투자하지 않았다는 텍스트를 보여줄 예정.
      {
        return res
          .status(200)
          .json({ totalCnt: 0, message: "해당기업에 투자한 정보가 없습니다." });
      }

      //페이지네이션을 위해 투자자 전체 값을 가져온다.
      const totalCnt = await prisma.investment.count({
        where: { companyId: companyId },
      });

      //투자별로 순위 확인.
      const rankData = investmentInfo.map((info, index) => {
        const rank = index + 1 + skipPage; //페이지 넘겼을 때도 순위값을 유지하기 위해 넘겨진 페이지값만큼 더한다.
        return { ...info, rank: rank };
      });

      const investmentData = BigIntToString(rankData);

      return res.status(200).json({ data: investmentData, totalCnt: totalCnt });
    } catch (error) {
      console.error("콘솔 로그 에러 내용:", error);
      return res.status(500).json({ message: "에러가 발생했습니다." });
    }
  },

  //기업에 투자하기
  PostInvestment: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, password, comment, amount } = req.body;

      const companyId = Number(id);

      //organization : "mystartup"고정 이유 - 해당 웹서비스에서 투자하는 것은 mystartup이기 때문.
      //다른곳에서 "ohter"로 투자할 수 있는 기능은 없는 것 같음.
      const createInvestment = {
        companyId: companyId,
        name: name,
        password: password,
        comment: comment,
        amount: amount,
        organization: "mystartup",
      };

      const investmentInfo = await prisma.investment.create({
        data: createInvestment,
      });

      const investmentData = BigIntToString(investmentInfo);
      return res.status(200).json(investmentData);
    } catch (error) {
      console.error("콘솔 로그 에러 내용:", error);
      return res.status(500).json({ message: "에러가 발생했습니다." });
    }
  },

  //비밀번호 체크
  //비밀번호 체크하는 부분이라 GET query보다는 body를 쓰는게 더 나아 보여서 POST로 작성했습니다.
  PasswordCheck: async (req, res) => {
    try {
      const { password } = req.body;
      const { id } = req.params;
      const investId = Number(id);

      const investmentInfo = await prisma.investment.findUnique({
        where: {
          id: investId,
        },
      });
      if (!investmentInfo) {
        return res.status(404).json({ message: "데이터가 없습니다." });
      }

      if (investmentInfo.password !== password)
        return res.status(401).json({ message: "비밀번호가 다릅니다." });
      else {
        //비밀번호 일치시 성공했다는 응답만 보내준다.
        return res.status(200).send();
      }
    } catch (error) {
      console.error("콘솔 로그 에러 내용:", error);
      return res.status(500).json({ message: "에러가 발생했습니다." });
    }
  },
};

//bigint값이 있으면 json보낼때 TypeError: Do not know how to serialize a BigInt
//라는 에러를 발생시킴 그래서 bigint값일 경우 string값으로 변경해서 보낸다.
//자세한 내용은 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/BigInt_not_serializable 참조.
function BigIntToString(data) {
  const resultData = JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? String(value) : value,
    ),
  );
  return resultData;
}
