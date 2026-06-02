import express from "express";
import cors from "cors";
import mypickController from "./controllers/mypick.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

// 나의 기업 비교 - 기업 목록 조회
app.get("/mypick/companies", mypickController.GetCompanies);
// 나의 기업 비교 - 나의 기업 선택
app.patch("/mypick/companies/:id/mypick", mypickController.PatchMypick);
// 나의 기업 비교 - 비교 기업 선택
app.patch("/mypick/companies/:id/comparison", mypickController.PatchComparison);

export default app;
``;
