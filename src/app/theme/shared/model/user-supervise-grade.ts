import { AcademicYear } from "./academic-year";
import { Grade } from "./grade";
import { School } from "./school";
import { User } from "./user";

export class UserSuperviseGrade {
  id?: number;
  uuid?: string;
  user?: User;
  assignedGrade : Grade;
  school?: School;
  academicYear : AcademicYear;
}
