// angular import
import { Component, DoCheck } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ThemeConfig } from 'src/app/app-config';

// bootstrap import
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/theme/shared/model/user';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { ChangePasswordComponent } from 'src/app/demo/pages/authentication/change-password/change-password.component';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements DoCheck {
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId: boolean;
  config: any;
  loginUser : User;

  // constructor
  constructor(config: NgbDropdownConfig,
    private userService: UserService,
    private router: Router,
    private notifier: NotifierService,
    private modalService: NgbModal,
    public commonSharedService : CommonSharedService) 
  {
    config.placement = 'bottom-right';
    this.visibleUserList = false;
    this.chatMessage = false;
    this.config = ThemeConfig;
    if(this.commonSharedService.loginUser)
    {
      this.loginUser = this.commonSharedService.loginUser;
      this.showNotification("default", "Welcome, " + this.loginUser.fullName);
    }
  }

  // public method
  onChatToggle(friend_id) {
    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;
  }

  // life cycle event
  ngDoCheck() {
    if (document.querySelector('body').classList.contains('datta-rtl')) {
      this.config['rtl-layout'] = true;
    } else {
      this.config['rtl-layout'] = false;
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async logout() 
  {
    try
    {
      let response = await this.userService.logout().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        localStorage.clear();
        this.showNotification("info", "Logout Successful");
        this.router.navigate(['/auth/signin']);
      }
    }
    catch(e)
    {
      this.showNotification("info", "Logout Unsuccessful");
    }
  }

  changePassword()
  {
    const dialogRef = this.modalService.open(ChangePasswordComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = "";
  }
}
