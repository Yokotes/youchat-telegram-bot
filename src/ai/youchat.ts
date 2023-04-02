import axios from "axios";
import { AIService } from ".";

export class YouChatService implements AIService {
  // TODO: Finish
  async sendRequest(text: string) {
    try {
      const test = await axios.get(
        `https://api.betterapi.net/youdotcom/chat?message=${
          text + (process.env.POSTFIX_TO_REQUEST || "")
        }&key=${process.env.YOUCHAT_TOKEN}`
      );

      return test.data.message;
    } catch (e) {
      console.error(e);
      return "Error while sending request to youchat";
    }
  }
}
