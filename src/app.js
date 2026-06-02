import express from "express";
import cors from "cors";
<<<<<<< HEAD
import mypickController from "./controllers/mypick.controller.js";
=======
import corpInvestController from "./controllers/corpinvest.controller.js";
import investCompaniesController from "./controllers/investcompanies.controller.js";
>>>>>>> 70a7a61fb56727572b27f7868ec377e17a45111a

const app = express();

app.use(cors());
app.use(express.json());

// 투자 현황 - 조회
app.get("/api/investcompanies", investCompaniesController.getInvestCompanies);

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

<<<<<<< HEAD
// 나의 기업 비교 - 기업 목록 조회
app.get("/mypick/companies", mypickController.GetCompanies);
// 나의 기업 비교 - 나의 기업 선택
app.patch("/mypick/companies/:id/mypick", mypickController.PatchMypick);
// 나의 기업 비교 - 비교 기업 선택
app.patch("/mypick/companies/:id/comparison", mypickController.PatchComparison);
=======
app.get("/api/companies/:id", corpInvestController.getCompany);
app.get("/api/companies/:id/investment", corpInvestController.getInvestment);

app.post("/api/investments/:id/password", corpInvestController.passwordCheck);

app.patch("/api/investments/:id", corpInvestController.patchInvestment);
app.delete("/api/investments/:id", corpInvestController.deleteInvestment);
>>>>>>> 70a7a61fb56727572b27f7868ec377e17a45111a

export default app;
``;
