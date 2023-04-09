import { YouChatService } from "../ai";
import { TelegramBot } from "../bot";
import { config } from "dotenv";
import { DBServiceStrategy } from "../db";

config();

const aiService = new YouChatService();
const DBService = DBServiceStrategy.getService();
const dbService = new DBService();
const telegramBot = new TelegramBot(aiService, dbService);

telegramBot.launch();
