import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserTeachChapterTopicsResolver implements Resolve<any> {
  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let uuid : string = route.paramMap.get('chapterUUID');
    return this.userService.getAssignedTopics(uuid);
  }
}
