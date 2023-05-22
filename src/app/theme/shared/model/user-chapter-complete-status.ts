import { AcademicYear } from "./academic-year";
import { Grade } from "./grade";
import { SchoolGradeSection } from "./school-grade-section";
import { SyllabusGradeSubject } from "./syllabus-grade-subject";
import { SyllabusGradeSubjectChapter } from "./syllabus-grade-subject-chapter";
import { SyllabusSubjectChapterTopic } from "./syllabus-subject-chapter-topic";
import { User } from "./user";

export class UserChapterCompleteStatus {
  id?: number;
  uuid?: string;
  academicYear?: AcademicYear;
  grade?: Grade;
  section?: SchoolGradeSection;
  subject?: SyllabusGradeSubject;
  chapter?: SyllabusGradeSubjectChapter;
  topic?: SyllabusSubjectChapterTopic;
  isCompleted?: number;
  completedOn?: Date;
  completedBy?: User;
}
