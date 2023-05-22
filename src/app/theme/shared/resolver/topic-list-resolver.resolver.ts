import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { CommonService } from '../service/common.service';

@Injectable({
  providedIn: 'root'
})
export class TopicListResolver implements Resolve<any> {
  constructor(private commonService: CommonService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let uuid : string = route.paramMap.get('chapterUUID');
    return this.commonService.getChapterTopics(uuid);
  }
}
