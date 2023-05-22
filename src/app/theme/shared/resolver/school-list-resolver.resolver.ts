import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { SchoolService } from '../service/school.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolListResolver implements Resolve<any> {
  constructor(private schoolService: SchoolService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.schoolService.getSchools();
  }
}
