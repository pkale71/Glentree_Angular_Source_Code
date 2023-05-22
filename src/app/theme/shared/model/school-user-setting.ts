import { School } from "./school";
import { UserType } from "./userType";

export class SchoolUserSetting {
  id?: number;
  uuid?: string;
  school?: School;
  userType?: UserType;
  canUpload?: number;
  canVerify?: number;
  canPublish?: number;
}
