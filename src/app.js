import express from "express";
import cors from "cors";
import { getTodo } from "./controllers/compareresult/mypick.controller.js";
import { compareCompanies } from "./controllers/compareresult/compare.controller.js";
import { rankCompanies } from "./controllers/compareresult/rank.controller.js";
import { createInvestment } from "./controllers/invest/invest.controller.js";
import mypickController from "./controllers/mypick.controller.js";

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

app.get("/api/companies/mypick/:id", getTodo);
app.get("/api/companies/rank/:id", rankCompanies);
app.get("/api/companies/compare/:ids", compareCompanies);
app.post("/api/invest/create", createInvestment);

// 나의 기업 비교 - 기업 목록 조회
app.get("/mypick/companies", mypickController.GetCompanies);
// 나의 기업 비교 - 나의 기업 선택
app.patch("/mypick/companies/:id/mypick", mypickController.PatchMypick);
// 나의 기업 비교 - 비교 기업 선택
app.patch("/mypick/companies/:id/comparison", mypickController.PatchComparison);

app.get("/api/companies/:id", corpInvestController.getCompany);
app.get("/api/companies/:id/investment", corpInvestController.getInvestment);

app.post("/api/investments/:id/password", corpInvestController.passwordCheck);

app.patch("/api/investments/:id", corpInvestController.patchInvestment);
app.delete("/api/investments/:id", corpInvestController.deleteInvestment);

export default app;
