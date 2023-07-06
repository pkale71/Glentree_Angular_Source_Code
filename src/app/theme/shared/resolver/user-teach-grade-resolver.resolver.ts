import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../service/user.service';
import { CommonSharedService } from '../service/common-shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserTeachGradeResolver implements Resolve<any> {
  constructor(private userService: UserService, private commonSharedService : CommonSharedService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let uuid : string = route.paramMap.get('userUUID');
    let schoolUUID = this.commonSharedService.loginUser.schools[0].uuid;
    return this.userService.getTeachGrades(uuid, schoolUUID);
  }
}
