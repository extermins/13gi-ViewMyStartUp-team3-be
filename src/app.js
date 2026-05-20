import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

export default app;
