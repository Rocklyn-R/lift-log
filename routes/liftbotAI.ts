import { getLiftBotReply } from "controllers/liftbotAI";
import express from "express";

const liftbotRouter = express.Router();

liftbotRouter.post("/", getLiftBotReply);

export default liftbotRouter;