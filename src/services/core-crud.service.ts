import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { GetManyDefaultResponse } from "@nestjsx/crud";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { CrudMethods, ServiceRoles } from "../enum";
import { DeepPartial } from "typeorm";
import { CoreCrudRequest } from "../interface";

export class CoreCrudService<T> extends TypeOrmCrudService<T> {
  public async checkAccess(req: CoreCrudRequest, method: CrudMethods) {
    const user = req.user;
    const roles: ServiceRoles[] = this.constructor.prototype.roles?.[method];

    let access = true;

    if (!user) throw new UnauthorizedException();

    if (!roles)
      throw new BadRequestException(
        `Role for method - ${method} not configured`
      );

    if (roles.includes(ServiceRoles.OWNER)) {
      const item: T | any = await this.getOneOrFail(req);

      access = item?.userId === user.id;
    }

    if (user.role === "admin") access = true;

    if (!access) throw new ForbiddenException();

    return access;
  }

  async getMany(
    req: CoreCrudRequest
  ): Promise<GetManyDefaultResponse<T> | T[]> {
    await this.checkAccess(req, CrudMethods.GET_MANY);
    return super.getMany(req);
  }

  async getOne(req: CoreCrudRequest): Promise<T> {
    await this.checkAccess(req, CrudMethods.GET_ONE);
    return super.getOne(req);
  }

  async createOne(req: CoreCrudRequest, dto: DeepPartial<T>): Promise<T> {
    await this.checkAccess(req, CrudMethods.CREATE_ONE);
    return super.createOne(req, { ...dto, userId: +req?.user?.id });
  }

  async updateOne(req: CoreCrudRequest, dto: DeepPartial<T>): Promise<T> {
    await this.checkAccess(req, CrudMethods.UPDATE_ONE);
    return super.updateOne(req, dto);
  }

  async deleteOne(req: CoreCrudRequest): Promise<void | T> {
    await this.checkAccess(req, CrudMethods.DELETE_ONE);
    return super.deleteOne(req);
  }
}
