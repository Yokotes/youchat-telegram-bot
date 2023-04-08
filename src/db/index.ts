export interface DBService {
  save(data: Record<string, any>): Promise<void>;
  load(): Promise<Record<string, any>>;
}
