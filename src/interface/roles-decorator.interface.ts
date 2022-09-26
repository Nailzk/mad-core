import { ServiceRoles } from "../enum";

export interface IRolesDecorator {
  createOne: ServiceRoles[];
  updateOne: ServiceRoles[];
  deleteOne: ServiceRoles[];
  getOne: ServiceRoles[];
  getMany: ServiceRoles[];
}
