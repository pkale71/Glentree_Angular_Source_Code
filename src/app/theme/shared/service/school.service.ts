import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  constructor(private apiService: ApiService) { }
  
  getSchools(){
    return this.apiService.get('/school/getSchools');
  }

  getSchool(uuid : string){
    return this.apiService.get('/school/getSchool/' + uuid);
  }

  getSchoolLogo(uuid : string){
    return this.apiService.get('/school/getSchoolLogo/' + uuid);
  }

  getSchoolGradeCategories(schoolUUID : string)
  {
    return this.apiService.get('/school/getSchoolGradeCategories/' + schoolUUID);
  }

  getSchoolGrades(schoolUUID : string)
  {
    return this.apiService.get('/school/getSchoolGrades/' + schoolUUID);
  }

  saveSchool(school : any)
  {
    return this.apiService.post('/school/createSchool', school);
  }

  updateSchool(school : any)
  {
    return this.apiService.post('/school/updateSchool', school);
  }

  changeStatus(uuid : any)
  {
    return this.apiService.get('/school/changeStatus/' + uuid);
  }
  
  deleteSchool(school : any)
  {
    return this.apiService.post('/school/deleteSchool', school);
  }
///Grade Section
  getSchoolGradeSections(academicYearUUID : string, schoolUUID : string, gradeCategoryId : number, gradeId : number)
  {
    if(gradeId == 0)
    {
      return this.apiService.get('/school/getGradeSections/' + academicYearUUID + '/' + schoolUUID + '/' + gradeCategoryId);
    }
    else if(gradeId > 0)
    {
      return this.apiService.get('/school/getGradeSections/' + academicYearUUID + '/' + schoolUUID + '/' + gradeCategoryId + '/' + gradeId);
    }
  }

  getSections(academicYearUUID : string, schoolUUID : string, gradeId : number)
  {
    return this.apiService.get('/school/getSections/' + academicYearUUID + '/' + schoolUUID + '/' + gradeId);
  }

  saveSchoolGradeSection(schoolGradeSection : any)
  {
    return this.apiService.post('/school/createGradeSection', schoolGradeSection);
  }

  deleteSchoolGradeSection(schoolGradeSection : any)
  {
    return this.apiService.post('/school/deleteGradeSection', schoolGradeSection);
  }
}
