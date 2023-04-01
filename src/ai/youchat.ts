import axios from "axios";
import { AIService } from ".";

export class YouChatService implements AIService {
  // TODO: Finish
  async sendRequest(text: string) {
    const test = await axios.get(
      `https://api.betterapi.net/youdotcom/chat?message=${text}&key=${process.env.YOUCHAT_TOKEN}`
    );

    return test.data.message;
  }
}
