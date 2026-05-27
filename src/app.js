import express from "express";
import cors from "cors";
import startupRoutes from "./routes/startups.js";
import investmentRoutes from "./routes/investments.js";
import compareRoutes from "./routes/compares.js";
import comparisonStatsRoutes from "./routes/comparisonStats.js";
import errorHandler from "./middleware/errorHandler.js";

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
        typeof value === "bigint" ? Number(value) : value
      )
    );
    return originalJson(serialized);
  };
  next();
});

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

app.use("/api/startups", startupRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/compares", compareRoutes);
app.use("/api/comparison-stats", comparisonStatsRoutes);

// 에러 핸들러는 라우터 등록 이후 마지막에 위치
app.use(errorHandler);

export default app;
