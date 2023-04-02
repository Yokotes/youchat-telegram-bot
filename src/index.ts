import { YouChatService } from "./ai";
import { TelegramBot } from "./bot";
import { config } from "dotenv";

config();

const aiService = new YouChatService();
const telegramBot = new TelegramBot(aiService);

telegramBot.launch();

module.exports = async (request: any, response: any) => {
  response.send("OK");
};
