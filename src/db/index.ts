import { EmptyDBService } from "./empty";
import { MongoDBService } from "./mongo";

export interface IDBService {
  save(data: Record<string, any>): Promise<void>;
  load(): Promise<Record<string, any>[]>;
}

export class DBServiceStrategy {
  static getService() {
    switch (true) {
      case !!process.env.MONGO_URL:
        return MongoDBService;
      default:
        EmptyDBService;
    }
  }
}
