import { YouChatService } from "../ai";
import { TelegramBot } from "../bot";
import { config } from "dotenv";
import { MongoDBService } from "../db/mongo";

config();

const aiService = new YouChatService();
const mongoService = new MongoDBService();
const telegramBot = new TelegramBot(aiService, mongoService);

telegramBot.launch();
