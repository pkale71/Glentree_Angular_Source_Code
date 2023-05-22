import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { CommonService } from '../service/common.service';

@Injectable({
  providedIn: 'root'
})
export class GradeDetailResolver implements Resolve<any> {
  constructor(private commonService: CommonService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id : number = parseInt(route.paramMap.get('gradeId'));
    return this.commonService.getGrade(id);
  }
}
