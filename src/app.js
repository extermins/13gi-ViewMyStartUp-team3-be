import express from "express";
import cors from "cors";
import startupsController from "./controllers/startups.controller.js";
import investmentsController from "./controllers/investments.controller.js";
import comparesController from "./controllers/compares.controller.js";
import comparisonStatsController from "./controllers/comparisonStats.controller.js";
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

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

app.get("/api/startups", startupsController.getList);
app.get("/api/startups/:id", startupsController.getOne);
app.post("/api/startups", startupsController.create);
app.put("/api/startups/:id", startupsController.update);
app.delete("/api/startups/:id", startupsController.remove);
app.post("/api/startups/:id/mypick", startupsController.addMypick);
app.delete("/api/startups/:id/mypick", startupsController.removeMypick);

app.get("/api/investments", investmentsController.getList);
app.post("/api/investments", investmentsController.create);
app.put("/api/investments/:id", investmentsController.update);
// 투자삭제 경로가 겹쳐서 주석처리 해둡니다.
// app.delete("/api/investments/:id", investmentsController.remove);

app.get("/api/compares", comparesController.getList);
app.get("/api/compares/:id", comparesController.getOne);
app.post("/api/compares/:id/compare", comparesController.addCompare);
app.delete("/api/compares/:id/compare", comparesController.removeCompare);

app.get("/api/comparison-stats", comparisonStatsController.getList);

app.get("/api/companies/mypick/:id", getTodo);
app.get("/api/companies/rank/:id", rankCompanies);
app.get("/api/companies/compare/:ids", compareCompanies);
app.post("/api/invest/create", createInvestment);

app.get("/api/mypick/companies", mypickController.GetCompanies);
app.patch("/api/mypick/companies/:id/mypick", mypickController.PatchMypick);
app.patch(
  "/api/mypick/companies/:id/comparison",
  mypickController.PatchComparison,
);

app.get("/api/companies/:id", corpInvestController.getCompany);
app.get("/api/companies/:id/investment", corpInvestController.getInvestment);

app.post("/api/investments/:id/password", corpInvestController.passwordCheck);

app.patch("/api/investments/:id", corpInvestController.patchInvestment);
app.delete("/api/investments/:id", corpInvestController.deleteInvestment);

export default app;
