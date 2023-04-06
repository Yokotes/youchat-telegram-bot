import { Telegraf } from "telegraf";
import { AIService } from "../ai";
import { writeFileSync, readFileSync } from "fs";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { TelegrafContext } from "telegraf/typings/context";

const VERCEL_URL = process.env.VERCEL_URL;

export class TelegramBot {
  private bot: Telegraf<TelegrafContext>;
  private data: Record<string, string>;

  constructor(private readonly aiService: AIService) {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.data = this.loadData();
  }

  launch() {
    this.addListeners();
    this.botUtils();
  }

  private botUtils() {
    this.bot.use(Telegraf.log());

    this.bot.start((ctx) => {
      return ctx.reply("This is a test bot.");
    });

    this.bot.command("about", () => console.log("test"));
  }

  private loadData() {
    try {
      const dataString = readFileSync("data/data.json").toString();
      const data = JSON.parse(dataString);

      return data;
    } catch (e) {
      console.error(e);
      return {};
    }
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

      this.launch();

      if (request.method === "POST") {
        this.bot.handleUpdate(request.body, response);
      } else {
        console.log("Waiting for events");
      }
    } catch (e) {
      console.error(e);
    }
  }

  private addListeners() {
    // Setting bot name
    this.bot.command("setname", ({ from, chat, reply, message }) => {
      // To prevent extra replies (I really don't know why `date` doesn't have last 3 numbers)
      if (from.id.toString() !== process.env.ADMIN_ID) {
        return reply("You don't have a permission!");
      }
      try {
        this.data[chat.id] = message.text;
        writeFileSync("data/data.json", JSON.stringify(this.data));
        reply("Data setted");
      } catch (e) {
        console.error(e);
      }
    });
    // TODO: Throws strange error on unformatted message
    this.bot.on("message", async ({ chat, message: { text }, reply }) => {
      // To prevent extra replies
      const name = this.data[chat.id];
      const splitedText = text.split(",");
      const possibleName = splitedText.shift();
      const requestText = splitedText.join(",").trim();
      if (name?.toLowerCase() !== possibleName.toLowerCase()) return;
      const response = await this.aiService.sendRequest(requestText);
      reply(response);
    });
  }
}
