import express from "express";
import cors from "cors";
import corpInvestController from "./controllers/corpinvest.controller.js";
import investCompaniesController from "./controllers/investcompanies.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

// 투자 현황 - 조회
app.get("/api/investcompanies", investCompaniesController.getInvestCompanies);

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

app.get("/api/companies/:id", corpInvestController.getCompany);
app.get("/api/companies/:id/investment", corpInvestController.getInvestment);

app.post("/api/investments/:id/password", corpInvestController.passwordCheck);

app.patch("/api/investments/:id", corpInvestController.patchInvestment);
app.delete("/api/investments/:id", corpInvestController.deleteInvestment);

export default app;
