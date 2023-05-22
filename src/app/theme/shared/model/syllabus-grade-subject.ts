import { Grade } from "./grade";
import { Syllabus } from "./syllabus";

export class SyllabusGradeSubject {
  id?: number;
  uuid?: string;
  name?: string;
  active?: number;
  isExist?: number;
  syllabus?: Syllabus;
  grade?: Grade;
}
