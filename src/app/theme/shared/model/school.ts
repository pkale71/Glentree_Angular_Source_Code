import { SchoolGradeCategory } from "./school-grade-category";
import { SchoolUserSetting } from "./school-user-setting";
import { Syllabus } from "./syllabus";
import { User } from "./user";

export class School {
  id?: number;
  uuid?: string;
  name?: string;
  location?: string;
  contact1?: string;
  contact2?: string;
  email?: string;
  curriculumUpload?: string;
  curriculumComplete?: string;
  syllabus?: Syllabus;
  gradeCategories?: SchoolGradeCategory[];
  createdOn?: Date;
  createdBy?: User;
  active?: boolean;
  curriculumExist?: number;
  curriculumCompleteExist?: number;
  isExist?: number;
  fileName?: string;
  schoolUserSetting?: SchoolUserSetting[];
}
