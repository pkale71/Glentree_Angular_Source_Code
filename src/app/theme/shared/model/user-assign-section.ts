import { AcademicYear } from "./academic-year";
import { Grade } from "./grade";
import { School } from "./school";
import { SchoolGradeSection } from "./school-grade-section";
import { SyllabusGradeSubject } from "./syllabus-grade-subject";
import { User } from "./user";

export class UserAssignSection {
  id?: number;
  uuid?: string;
  user?: User;
  subject : SyllabusGradeSubject;
  assignedSection : SchoolGradeSection;
  school?: School;
  academicYear : AcademicYear;
}
