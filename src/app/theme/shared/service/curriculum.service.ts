import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CurriculumService {
  constructor(private apiService: ApiService) { }
  
  getCurriculumUploads(academicYearUUID : string, schoolUUID : string, gradeId : number, subjectUUID : string, 
    chapterUUID : string, topicUUID : string, status : string){
    return this.apiService.get('/curriculum/getCurriculumUploads/' + status + '/' + academicYearUUID + '/' + schoolUUID + '/' + 
    gradeId + '/' + subjectUUID + '/' + chapterUUID + '/' + topicUUID);
  }

  getCurriculumUpload(uuid : string){
    return this.apiService.get('/curriculum/getCurriculumUpload/' + uuid);
  }

  getCurriculumUploadFile(uuid : string){
    return this.apiService.get('/curriculum/getCurriculumUploadFile/' + uuid);
  }

  verifyFiles(curriculumFiles : any)
  {
    return this.apiService.post('/curriculum/verifyFiles', curriculumFiles);
  }

  saveCurriculum(curriculum : any)
  {
    return this.apiService.post('/curriculum/saveCurriculum', curriculum);
  }

  changeStatus(curriculum : any)
  {
    return this.apiService.post('/curriculum/changeStatus', curriculum);
  }

  deleteCurriculumUpload(curriculum : any)
  {
    return this.apiService.post('/curriculum/deleteCurriculumUpload', curriculum);
  }
}
