import express from "express";
import cors from "cors";
import CorpInvestController from "./controllers/corpinvest.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

app.get("/api/companies/:id", CorpInvestController.GetCompany);
app.get("/api/companies/:id/investment", CorpInvestController.GetInvestment);

app.post("/api/companies/:id/investment", CorpInvestController.PostInvestment);
app.post("/api/investments/:id/password", CorpInvestController.PasswordCheck);

app.patch("/api/investments/:id", CorpInvestController.PatchInvestment);
app.delete("/api/investments/:id", CorpInvestController.DeleteInvestment);

export default app;
