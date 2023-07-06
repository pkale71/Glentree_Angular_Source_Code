import { AcademicYear } from "./academic-year";
import { Grade } from "./grade";
import { School } from "./school";
import { SyllabusGradeSubject } from "./syllabus-grade-subject";
import { SyllabusGradeSubjectChapter } from "./syllabus-grade-subject-chapter";
import { SyllabusSubjectChapterTopic } from "./syllabus-subject-chapter-topic";
import { User } from "./user";

export class Curriculum {
  id?: number;
  uuid?: string;
  academicYear?: AcademicYear;
  school?: School;
  grade?: Grade
  subject?: SyllabusGradeSubject;
  chapter?: SyllabusGradeSubjectChapter;
  topic?: SyllabusSubjectChapterTopic;
  createdOn?: Date;
  createdBy?: User;
}
