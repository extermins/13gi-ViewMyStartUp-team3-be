import express from "express";
import cors from "cors";
import startupRoutes from "./routes/startups.js";
import investmentRoutes from "./routes/investments.js";
import compareRoutes from "./routes/compares.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

app.use("/api/startups", startupRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/compares", compareRoutes);

// 에러 핸들러는 라우터 등록 이후 마지막에 위치
app.use(errorHandler);

export default app;
