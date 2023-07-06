import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private apiService: ApiService) { }
  
  getUserRoles() 
  {
    return this.apiService.get('/common/getRoles');
  }

  getUserTypes() 
  {
    return this.apiService.get('/common/getUserTypes');
  }

  getGradeCategories() 
  {
    return this.apiService.get('/common/getGradeCategories');
  }
//Syllabus
  getSyllabuses() 
  {
    return this.apiService.get('/common/getSyllabuses');
  }

  saveSyllabus(syllabus : any)
  {
    return this.apiService.post('/common/createSyllabus', syllabus);
  }

  deleteSyllabus(syllabus : any)
  {
    return this.apiService.post('/common/deleteSyllabus', syllabus);
  }
//Academic Year
  getAcademicYears() 
  {
    return this.apiService.get('/common/getAcademicYears');
  }

  getAcademicYear(uuid : string) 
  {
    return this.apiService.get('/common/getAcademicYear/' + uuid);
  }

  getCurrentAcademicYear() 
  {
    return this.apiService.get('/common/getCurrentAcademicYear');
  }

  saveAcademicYear(academicYear : any)
  {
    return this.apiService.post('/common/createAcademicYear', academicYear);
  }

  deleteAcademicYear(academicYear : any)
  {
    return this.apiService.post('/common/deleteAcademicYear', academicYear);
  }

//Grade
  getGrades(gradeCategoryId :number) 
  {
    if(gradeCategoryId == 0)
    {
      return this.apiService.get('/common/getGrades');
    }
    else
    {
      return this.apiService.get('/common/getGrades/' + gradeCategoryId);
    }
  }

  getGrade(id : number) 
  {
    return this.apiService.get('/common/getGrade/' + id);
  }

  saveGrade(grade : any)
  {
    return this.apiService.post('/common/createGrade', grade);
  }

  updateGrade(grade : any)
  {
    return this.apiService.post('/common/updateGrade', grade);
  }

  deleteGrade(grade : any)
  {
    return this.apiService.post('/common/deleteGrade', grade);
  }

  //Grade Subject
  getGradeSubjects(syllabusId : number, gradeId : number) 
  {
    return this.apiService.get('/common/getGradeSubjects/' + syllabusId + '/' + gradeId);
  }

  getGradeSubject(uuid : string) 
  {
    return this.apiService.get('/common/getGradeSubject/' + uuid);
  }

  saveGradeSubject(gradeSubject : any)
  {
    return this.apiService.post('/common/createGradeSubject', gradeSubject);
  }

  updateGradeSubject(gradeSubject : any)
  {
    return this.apiService.post('/common/updateGradeSubject', gradeSubject);
  }

  changeGradeSubjectStatus(uuid : string)
  {
    return this.apiService.get('/common/changeGradeSubjectStatus/' + uuid);
  }

  deleteGradeSubject(gradeSubject : any)
  {
    return this.apiService.post('/common/deleteGradeSubject', gradeSubject);
  }

  //Grade Subject Chapter
  getSubjectChapters(subjectUUID : string) 
  {
    return this.apiService.get('/common/getSubjectChapters/' + subjectUUID);
  }

  getSubjectChapter(uuid : string) 
  {
    return this.apiService.get('/common/getSubjectChapter/' + uuid);
  }

  saveSubjectChapter(gradeSubjectChapter : any)
  {
    return this.apiService.post('/common/createSubjectChapter', gradeSubjectChapter);
  }

  updateSubjectChapter(gradeSubjectChapter : any)
  {
    return this.apiService.post('/common/updateSubjectChapter', gradeSubjectChapter);
  }

  changeSubjectChapterStatus(uuid : string)
  {
    return this.apiService.get('/common/changeSubjectChapterStatus/' + uuid);
  }

  deleteSubjectChapter(gradeSubjectChapter : any)
  {
    return this.apiService.post('/common/deleteSubjectChapter', gradeSubjectChapter);
  }
  
  //Grade Chapter Topic
  getChapterTopics(chapterUUID : string) 
  {
    return this.apiService.get('/common/getChapterTopics/' + chapterUUID);
  }

  getChapterTopic(uuid : string) 
  {
    return this.apiService.get('/common/getChapterTopic/' + uuid);
  }

  saveChapterTopic(chapterTopic : any)
  {
    return this.apiService.post('/common/createChapterTopic', chapterTopic);
  }

  updateChapterTopic(chapterTopic : any)
  {
    return this.apiService.post('/common/updateChapterTopic', chapterTopic);
  }

  changeChapterTopicStatus(uuid : string)
  {
    return this.apiService.get('/common/changeChapterTopicStatus/' + uuid);
  }

  deleteChapterTopic(chapterTopic : any)
  {
    return this.apiService.post('/common/deleteChapterTopic', chapterTopic);
  }

  //Material Type & File Type
  getFileTypes() 
  {
    return this.apiService.get('/common/getFileTypes');
  }

  getMaterialTypes() 
  {
    return this.apiService.get('/common/getMaterialTypes');
  }

  getMaterialType(uuid : string) 
  {
    return this.apiService.get('/common/getMaterialType/' + uuid);
  }

  saveMaterialType(materialType : any)
  {
    return this.apiService.post('/common/saveMaterialType', materialType);
  }

  updateMaterialType(materialType : any)
  {
    return this.apiService.post('/common/updateMaterialType', materialType);
  }

  deleteMaterialType(materialType : any)
  {
    return this.apiService.post('/common/deleteMaterialType', materialType);
  }
}
