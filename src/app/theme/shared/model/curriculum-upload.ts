import { AcademicYear } from "./academic-year";
import { Curriculum } from "./curriculum";
import { Grade } from "./grade";
import { MaterialType } from "./material-type";
import { School } from "./school";
import { SyllabusGradeSubject } from "./syllabus-grade-subject";
import { SyllabusGradeSubjectChapter } from "./syllabus-grade-subject-chapter";
import { SyllabusSubjectChapterTopic } from "./syllabus-subject-chapter-topic";
import { User } from "./user";

export class CurriculumUpload {
  id?: number;
  uuid?: string;
  curriculum?: Curriculum;
  materialType?: MaterialType;
  fileName?: string;
  active?: number;
  status?: string;
  uploadedOn?: Date;
  uploadedBy?: User;
  published?: number;
  publishedOn?: Date;
  publishedBy?: User;
  verified?: number;
  verifiedOn?: Date;
  verifiedBy?: User;
  rejected?: number;
  rejectedOn?: Date;
  rejectedBy?: User;
}
