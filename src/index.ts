import { YouChatService } from "./ai";
import { TelegramBot } from "./bot";
import { config } from "dotenv";

config();

const aiService = new YouChatService();
const telegramBot = new TelegramBot(aiService);

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
