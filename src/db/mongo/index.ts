// import { NameModel } from "./models";
import mongoose, { Model, Schema } from "mongoose";
import { IDBService } from "..";
import { nameSchema } from "./models";

interface Name {
  chatId: string;
  name: string;
}

export class MongoDBService implements IDBService {
  // TODO: fix types
  private models: {
    NameModel: any;
  };

  constructor() {
    const connection = mongoose.createConnection(process.env.MONGO_URL);

    this.models = { NameModel: connection.model("Name", nameSchema) };
  }

  async save(data: Name) {
    try {
      await this.models.NameModel.updateOne({ chatId: data.chatId }, data, {
        strict: false,
        upsert: true,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async load() {
    try {
      const data = await this.models.NameModel.find();
      return data;
    } catch (e) {
      console.error(e);
    }
    return [];
  }
}
