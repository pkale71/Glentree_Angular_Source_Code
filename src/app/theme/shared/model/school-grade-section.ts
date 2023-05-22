import { AcademicYear } from "./academic-year";
import { Grade } from "./grade";
import { GradeCategory } from "./grade-category";
import { School } from "./school";

export class SchoolGradeSection {
  id?: number;
  uuid?: string;
  name?: string;
  school?: School;
  academicYear?: AcademicYear;
  gradeCategory?: GradeCategory;
  grade? : Grade;
}
