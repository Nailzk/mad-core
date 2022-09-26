import { IRolesDecorator } from "../interface";

export function Roles(roles: IRolesDecorator) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (constructor: Function) {
    constructor.prototype.roles = roles;
  };
}
