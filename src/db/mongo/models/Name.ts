import { Schema } from "mongoose";

export const nameSchema = new Schema({
  chatId: String,
  name: String,
});
