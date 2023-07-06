import { Grade } from "./grade";
import { UserSuperviseGrade } from "./user-supervise-grade";

export class GradeCategory {
  id?: number;
  name?: string;
  grades?: Grade[];
  userSuperviseGrades : UserSuperviseGrade[];
}
