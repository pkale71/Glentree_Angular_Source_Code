import { Component, Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CommonSharedService } from './common-shared.service';

@Injectable()
export class AuthGuardService implements CanActivate
{
    constructor(public router: Router, public commonSharedService : CommonSharedService) {}

    canActivate(): boolean 
    {
        if (!this.commonSharedService.loginUser)
        {
            this.router.navigateByUrl('/auth/signin');
            return false;
        }
        return true;
    }
}