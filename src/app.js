import express from "express";
import cors from "cors";
import startupRoutes from "./routes/startups.js";
import investmentRoutes from "./routes/investments.js";
import compareRoutes from "./routes/compares.js";
import comparisonStatsRoutes from "./routes/comparisonStats.js";
import { getTodo } from "./controllers/compareresult/mypick.controller.js";
import { compareCompanies } from "./controllers/compareresult/compare.controller.js";
import { rankCompanies } from "./controllers/compareresult/rank.controller.js";
import { createInvestment } from "./controllers/invest/invest.controller.js";
import mypickController from "./controllers/mypick.controller.js";
import corpInvestController from "./controllers/corpinvest.controller.js";
import investCompaniesController from "./controllers/investcompanies.controller.js";
import { getCompanies } from "./controllers/companies.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

// BigInt 직렬화 처리 — Prisma가 BigInt를 반환할 때 JSON.stringify가 에러를 내므로
// 응답 전에 BigInt를 Number로 변환 (revenue, amount 필드 대응)
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    const serialized = JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === "bigint" ? Number(value) : value,
      ),
    );
    return originalJson(serialized);
  };
  next();
});

// 투자 현황 - 조회
app.get("/api/investcompanies", investCompaniesController.getInvestCompanies);

// 메인 페이지 - 기업 전체 리스트 조회
app.get("/api/companies", getCompanies);

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

app.use("/api/startups", startupRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/compares", compareRoutes);
app.use("/api/comparison-stats", comparisonStatsRoutes);

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
