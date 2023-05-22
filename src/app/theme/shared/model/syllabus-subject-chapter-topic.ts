import { SyllabusGradeSubjectChapter } from "./syllabus-grade-subject-chapter";
import { UserChapterCompleteStatus } from "./user-chapter-complete-status";

export class SyllabusSubjectChapterTopic {
  id?: number;
  uuid?: string;
  name?: string;
  active?: number;
  isExist?: number;
  subjectChapter?: SyllabusGradeSubjectChapter;
  userChapterCompleteStatuses : UserChapterCompleteStatus[];
}
