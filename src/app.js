import express from "express";
import cors from "cors";
import CorpInvestController from "./controllers/corpinvest.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

app.get("/api/companies/:id", CorpInvestController.getCompany);
app.get("/api/companies/:id/investment", CorpInvestController.getInvestment);

app.post("/api/investments/:id/password", CorpInvestController.passwordCheck);

app.patch("/api/investments/:id", CorpInvestController.patchInvestment);
app.delete("/api/investments/:id", CorpInvestController.deleteInvestment);

export default app;
