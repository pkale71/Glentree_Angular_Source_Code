import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { CurriculumService } from '../service/curriculum.service';

@Injectable({
  providedIn: 'root'
})
export class CurriculumUploadFileResolver implements Resolve<any> {
  constructor(private curriculumService: CurriculumService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let uuid : string = route.paramMap.get('curriculumUploadUUID');
    return this.curriculumService.getCurriculumUploadFile(uuid);
  }
}
