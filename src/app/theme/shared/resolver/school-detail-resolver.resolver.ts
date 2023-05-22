import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { SchoolService } from '../service/school.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolDetailResolver implements Resolve<any> {
  constructor(private schoolService: SchoolService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let uuid : string = route.paramMap.get('schoolUUID');
    return this.schoolService.getSchool(uuid);
  }
}
