import { YouChatService } from "../src/ai";
import { TelegramBot } from "../src/bot";
import { config } from "dotenv";
import { DBServiceStrategy } from "../src/db";

config();

const aiService = new YouChatService();
const DBService = DBServiceStrategy.getService();
const dbService = new DBService();
const telegramBot = new TelegramBot(aiService, dbService);

module.exports = async (request: any, response: any) => {
  try {
    await telegramBot.useWebhook(request, response);
  } catch (e) {
    response.statusCode = 500;
    response.setHeader("Content-Type", "text/html");
    response.end("<h1>Server Error</h1><p>Sorry, there was a problem</p>");
    console.error(e.message);
  }
};
