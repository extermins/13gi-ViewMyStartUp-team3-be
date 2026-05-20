import express from "express";
import cors from "cors";
import {
  getCompanies,
  postComparison,
  postMypick,
} from "./controllers/compare.controller";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

// 나의 기업 비교 - 기업 목록 조회
app.get("/compare/companies", getCompanies);
// 나의 기업 선택 - 기업 목록 조회
app.get("/compare/companies/:id/mypick", postMypick);
// 비교 기업 선택 - 기업 목록 조회
app.get("/compare/companies/:id/comparison", postComparison);

export default app;
