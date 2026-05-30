import express from "express";
import cors from "cors";
import { getTodo } from "./controllers/compareresult/mypick.controller.js";
import { compareCompanies } from "./controllers/compareresult/compare.controller.js";
import { rankCompanies } from "./controllers/compareresult/rank.controller.js";
import { createInvestment } from "./controllers/invest/invest.controller.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);
app.get("/api/companies/mypick/:id", getTodo);
app.get("/api/companies/rank/:id", rankCompanies);
app.get("/api/companies/compare/:ids", compareCompanies);
app.post("/api/invest/create", createInvestment);
export default app;
