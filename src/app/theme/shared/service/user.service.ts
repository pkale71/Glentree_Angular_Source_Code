import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) { }
  
  authenticateUser(authParams : any) 
  {
    return this.apiService.post('/authenticate', authParams);
  }

  changePassword(data : any) 
  {
    return this.apiService.post('/changePassword', data);
  }

  logout() 
  {
    return this.apiService.get('/logout');
  }

  getUser(uuid : string)
  {
    return this.apiService.get('/user/getUser/' + uuid);
  }

  checkDuplicateEmailMobile(data : any)
  {
    return this.apiService.post('/user/checkDuplicateEmailMobile', data);
  }

  getUsers(roleId : number, userTypeId : number, schoolUUID : string)
  {
    return this.apiService.get('/user/getUsers/' + roleId + '/' + userTypeId + '/' + schoolUUID);
  }

  saveUser(user : any)
  {
    return this.apiService.post('/user/createUser', user);
  }

  updateUser(user : any)
  {
    return this.apiService.post('/user/updateUser', user);
  }

  changeStatus(uuid : string)
  {
    return this.apiService.get('/user/changeStatus/' + uuid);
  }

  deleteUser(user : any)
  {
    return this.apiService.post('/user/deleteUser', user);
  }
  ////User Assigned Grades
  getUnassignedGrades(academicYearUUID : string, schoolUUID : string, gradeCategoryId : number)
  {
    return this.apiService.get('/user/getUnassignedGrades/' + academicYearUUID + '/' + schoolUUID + '/' + gradeCategoryId);
  }

  saveUserAssignGrade(userSuperviceGrade : any)
  {
    return this.apiService.post('/user/saveAssignedGrades', userSuperviceGrade);
  }

  deleteUserAssignGrade(userSuperviceGrade : any)
  {
    return this.apiService.post('/user/deleteAssignedGrades', userSuperviceGrade);
  }

  getAssignedGrades(userUUID : string, academicYearUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getAssignedGrades/' + userUUID + '/' + academicYearUUID + '/' + schoolUUID);
  }

  ////User Assigned Grade Subjects
  getUnassignedGradeSubjects(academicYearUUID : string, schoolUUID : string, gradeId : number)
  {
    return this.apiService.get('/user/getUnassignedGradeSubjects/' + academicYearUUID + '/' + gradeId + '/' + schoolUUID);
  }

  saveUserAssignGradeSubject(userSuperviceGradeSubject : any)
  {
    return this.apiService.post('/user/saveAssignedGradeSubjects', userSuperviceGradeSubject);
  }

  deleteUserAssignGradeSubject(userSuperviceGradeSubject : any)
  {
    return this.apiService.post('/user/deleteAssignedGradeSubjects', userSuperviceGradeSubject);
  }

  getAssignedGradeSubjects(userUUID : string, academicYearUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getAssignedGradeSubjects/' + userUUID + '/' + academicYearUUID + '/' + schoolUUID);
  }

  ////User Assigned Grade Sections
  getUnassignedGradeSections(academicYearUUID : string, gradeId : number, subjectUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getUnassignedGradeSubjectSections/' + academicYearUUID + '/' + gradeId + '/' + subjectUUID + '/' + schoolUUID);
  }

  saveUserAssignGradeSection(userAssignGradeSection : any)
  {
    return this.apiService.post('/user/saveAssignedGradeSections', userAssignGradeSection);
  }

  deleteUserAssignGradeSection(userAssignGradeSection : any)
  {
    return this.apiService.post('/user/deleteAssignedGradeSections', userAssignGradeSection);
  }

  getAssignedGradeSections(userUUID : string, academicYearUUID : string, schoolUUID : string, gradeId : number)
  {
    return this.apiService.get('/user/getAssignedGradeSections/' + userUUID + '/' + academicYearUUID + '/' + schoolUUID + "/" + gradeId);
  }

  ////User Assigned Grade Sections APIS For Curriculum Completion
  getTeachGrades(userUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getTeachGrades/' + userUUID + '/' + schoolUUID);
  }

  getTeachSubjects(userUUID : string, gradeId : number, schoolUUID : string)
  {
    return this.apiService.get('/user/getTeachSubjects/' + userUUID + '/' + gradeId + '/' + schoolUUID);
  }

  getAssignedChapters(subjectUUID : string)
  {
    return this.apiService.get('/user/getAssignedChapters/' + subjectUUID);
  }

  getAssignedTopics(chapterUUID : string)
  {
    return this.apiService.get('/user/getAssignedTopics/' + chapterUUID);
  }

  getTeachGradeSections(userUUID : string, gradeId : number, subjectUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getTeachGradeSections/' + userUUID + '/' + gradeId + '/' + subjectUUID + '/' + schoolUUID);
  }

  //Chapter Complete Status
  getUserChapterCompleteStatuses(academicYearUUID : string, userUUID: string, gradeId : number, 
  subjectUUID : string, sectionUUID : string, chapterUUID : string)
  {
    if(chapterUUID != null)
    {
      return this.apiService.get('/user/getUserChapterCompleteStatuses/' + academicYearUUID + '/' + userUUID + '/' + gradeId + '/' + subjectUUID + '/' + sectionUUID + '/' + chapterUUID);
    }
    else
    {
      return this.apiService.get('/user/getUserChapterCompleteStatuses/' + academicYearUUID + '/' + userUUID + '/' + gradeId + '/' + subjectUUID + '/' + sectionUUID);
    }
  }

  saveUserChapterCompleteStatus(userChapterCompleteStatus : any)
  {
    return this.apiService.post('/user/saveUserChapterCompleteStatus', userChapterCompleteStatus);
  }

  updateUserChapterCompleteStatus(userChapterCompleteStatus : any)
  {
    return this.apiService.post('/user/updateUserChapterCompleteStatus', userChapterCompleteStatus);
  }

  deleteUserChapterCompleteStatus(userChapterCompleteStatus : any)
  {
    return this.apiService.post('/user/deleteUserChapterCompleteStatus', userChapterCompleteStatus);
  }
}
