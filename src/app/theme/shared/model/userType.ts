import { Role } from "./role";

export class UserType {
  id?: number;
  name?: string;
  code?:string;
  active?: boolean;
  role?: Role;
}
