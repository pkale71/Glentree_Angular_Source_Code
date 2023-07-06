import { Role } from "./role";
import { School } from "./school";
import { UserSchool } from "./user-school";
import { UserType } from "./userType";

export class User {
  id?: number;
  uuid?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: Role;
  userType?: UserType;
  mobile?: string;
  email?: string;
  gender?: string;
  schools?: School[];
  password?: string;
  active?: boolean;
  createdOn?: Date;
  createdBy?: User;
  deletedOn?: Date;
  deletedBy?: User;
  lastLogin?: Date;
  userTypeExist?: number;
  accessToken?: string;
}
