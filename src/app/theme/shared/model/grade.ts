import { GradeCategory } from "./grade-category";
import { School } from "./school";
import { SchoolGradeSection } from "./school-grade-section";
import { SyllabusGradeSubject } from "./syllabus-grade-subject";
import { UserAssignSection } from "./user-assign-section";
import { UserAssignSubject } from "./user-assign-subject";

export class Grade {
  id?: number;
  name?: string;
  gradeCategory?: GradeCategory;
  school?: School;
  gradeSubjects : SyllabusGradeSubject[];
  sections?: SchoolGradeSection[];
  userAssignedSections : UserAssignSection[];
  userAssignedSubjects : UserAssignSubject[];
}
