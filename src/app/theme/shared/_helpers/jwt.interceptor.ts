import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { CommonSharedService } from '../service/common-shared.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  user : User;
  constructor(public commonSharedService : CommonSharedService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    if(this.commonSharedService.loginUser)
    {
      this.user = this.commonSharedService.loginUser;
      const isLoggedIn = this.user?.accessToken;
      const isApiUrl = request.url.startsWith(environment.apiUrl);
      if (isLoggedIn && isApiUrl) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.user.accessToken}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
