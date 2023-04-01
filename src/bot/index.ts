import NodeTelegramBot from "node-telegram-bot-api";
import { AIService } from "../ai";
import { writeFileSync, readFileSync } from "fs";

export class TelegramBot {
  private bot: NodeTelegramBot;
  private data: Record<string, string>;

  constructor(private readonly aiService: AIService) {
    this.bot = new NodeTelegramBot(process.env.BOT_TOKEN, { polling: true });
    this.data = this.loadData();
  }

  launch() {
    this.addListeners();
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

  private addListeners() {
    // Setting bot name
    this.bot.onText(/\/setname (.+)/, ({ from, chat, date }, match) => {
      // To prevent extra replies (I really don't know why `date` doesn't have last 3 numbers)
      const now = new Date().getTime().toString();
      if (+now.slice(0, now.length - 3) > date) return;

      if (from.id.toString() !== process.env.ADMIN_ID) {
        return this.bot.sendMessage(chat.id, "You don't have a permission!");
      }

      try {
        this.data[chat.id] = match[1];

        writeFileSync("data/data.json", JSON.stringify(this.data));
        this.bot.sendMessage(chat.id, "Data setted");
      } catch (e) {
        console.error(e);
      }
    });

    // TODO: Throws strange error on unformatted message
    this.bot.on("message", async ({ chat, text }) => {
      if (!text) return;
      console.log(text);

      const name = this.data[chat.id];
      const splitedText = text.split(",");
      const possibleName = splitedText.shift();
      const requestText = splitedText.join(",").trim();

      if (name?.toLowerCase() !== possibleName.toLowerCase()) return;

      const response = await this.aiService.sendRequest(requestText);
      console.log(response);
      this.bot.sendMessage(chat.id, response);
    });
  }
}
