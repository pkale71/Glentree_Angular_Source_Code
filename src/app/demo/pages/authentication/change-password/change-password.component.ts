import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/theme/shared/service/user.service';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  @Input() public modalParams;
  changePasswordForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(
    private userService: UserService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    private router : Router,
    public commonSharedService : CommonSharedService) 
  {
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.changePasswordForm = this.formbuilder.group({
      oldPassword:['', [Validators.required]],
      newPassword: ['',[Validators.required,Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(6)]],
    },{ 
      validator: this.commonSharedService.confirmPasswordValidator('newPassword', 'confirmPassword')
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async savePassword()
  {
    if(!this.saveClicked)
    {
      let checkSchoolManditory : boolean = false;
      if(this.changePasswordForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.userService.changePassword(this.changePasswordForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Password Changed");
    ///call logout service        
            let response1 = await this.userService.logout().toPromise();
            if (response1.status_code == 200 && response1.message == 'success') 
            {
              localStorage.clear();
              this.closeModal();
              this.router.navigate(['/auth/signin']);
            }
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
        this.saveClicked = false;
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}


