import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private apiService: ApiService) { }
  
  getChapterCompleteStatusReport(academicYearUUID : string, gradeId : number, 
  subjectUUID : string, chapterUUID : string)
  {
    if(chapterUUID != null)
    {
      return this.apiService.get('/report/getChapterCompleteStatusReport/' + academicYearUUID + '/' + gradeId + '/' + subjectUUID + '/' + chapterUUID);
    }
    else
    {
      return this.apiService.get('/report/getChapterCompleteStatusReport/' + academicYearUUID + '/' + gradeId + '/' + subjectUUID);
    }
  }
}
