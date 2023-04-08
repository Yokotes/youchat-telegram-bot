// import { NameModel } from "./models";
import mongoose, { Model, Schema } from "mongoose";
import { DBService } from "..";
import { nameSchema } from "./models";

interface Name {
  chatId: string;
  name: string;
}

export class MongoDBService implements DBService {
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
    return {};
  }
}
