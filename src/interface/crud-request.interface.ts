import { CrudRequest } from "@nestjsx/crud";

export interface CoreCrudRequest extends CrudRequest {
  user: { id: number; role: string };
}
