export interface AIService {
  sendRequest(text: string): Promise<string>;
}

export * from "./youchat";
