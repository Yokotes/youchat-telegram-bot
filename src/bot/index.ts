import { Telegraf } from "telegraf";
import { AIService } from "../ai";
import { writeFileSync, readFileSync } from "fs";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { TelegrafContext } from "telegraf/typings/context";
import * as path from "path";
import { IDBService } from "../db";

const VERCEL_URL = process.env.VERCEL_URL;

export class TelegramBot {
  private bot: Telegraf<TelegrafContext>;
  private data: Record<string, string>;

  constructor(
    private readonly aiService: AIService,
    private readonly dbService: IDBService
  ) {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
  }

  async launch() {
    this.data = await this.loadData();
    this.addListeners();
    // this.botUtils();
    await this.bot.launch();
    console.log("bot started");
  }

  private botUtils() {
    this.bot.use(Telegraf.log());

    this.bot.start((ctx) => {
      return ctx.reply("This is a test bot.");
    });

    this.bot.command("about", () => console.log("test"));
  }

  private async loadData() {
    const rawData = await this.dbService.load();
    // TODO: Fix types
    const data = rawData.reduce((acc, item) => {
      acc[item.chatId] = item.name;
      return acc;
    }, {} as typeof this.data);

    return data;
  }

  async useWebhook(request: VercelRequest, response: VercelResponse) {
    try {
      const getWebhookInfo = await this.bot.telegram.getWebhookInfo();

      const botInfo = await this.bot.telegram.getMe();
      this.bot.options.username = botInfo.username;
      console.info(
        "Server has initialized bot username using Webhook. ",
        botInfo.username
      );

      if (getWebhookInfo.url !== VERCEL_URL + "/api") {
        await this.bot.telegram.deleteWebhook();
        await this.bot.telegram.setWebhook(`${VERCEL_URL}/api`);
      }

      await this.launch();

      if (request.method === "POST") {
        this.bot.handleUpdate(request.body, response);
      } else {
        response.status(200).json("Listening for events...");
      }
    } catch (e) {
      console.error(e);
    }
  }

  private addListeners() {
    // Setting bot name
    this.bot.command("setname", async ({ from, chat, reply, message }) => {
      // To prevent extra replies (I really don't know why `date` doesn't have last 3 numbers)
      if (from.id.toString() !== process.env.ADMIN_ID) {
        return reply("You don't have a permission!");
      }
      const name = message.text.split(" ").slice(1).join(" ");
      this.data[chat.id] = name;
      await this.dbService.save({ chatId: chat.id, name });
      reply("Data were setted");
    });
    // TODO: Throws strange error on unformatted message
    this.bot.on("message", async ({ chat, message: { text }, reply }) => {
      // To prevent extra replies
      const name = this.data[chat.id];
      const splitedText = text.split(",");
      const possibleName = splitedText.shift();
      const requestText = splitedText.join(",").trim();

      if (name?.toLowerCase() !== possibleName.toLowerCase()) return;

      reply("Thinking...");

      const response = await this.aiService.sendRequest(requestText);
      reply(response);
    });
  }
}
