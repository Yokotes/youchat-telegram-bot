import { IDBService } from ".";

export class EmptyDBService implements IDBService {
  async save(data: Record<string, any>): Promise<void> {}
  async load(): Promise<Record<string, any>[]> {
    return [{}];
  }
}
