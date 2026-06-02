import express from "express";
import cors from "cors";
import investCompaniesController from "./controllers/investcompanies.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/investcompanies", investCompaniesController.getInvestCompanies);

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "연결 테스트 확인용임" }),
);

export default app;
