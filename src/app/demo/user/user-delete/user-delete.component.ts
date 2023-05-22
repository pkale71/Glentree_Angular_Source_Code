import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent {
  @Input() public modalParams;
  uuid : string;
  deleteClicked : boolean;
  deleteUserForm : FormGroup;

  constructor(
    private userService: UserService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService) 
  {
  }

  ngOnInit() 
  {
    //get Modal params
    this.uuid = this.modalParams.uuid;
    this.deleteClicked = false;
    /////

    this.deleteUserForm = this.formbuilder.group({
      'uuid': [this.uuid, [Validators.required]]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async deleteUser()
  {
    if(!this.deleteClicked)
    {
      if(this.deleteUserForm.valid)
      {
        this.deleteClicked = true;
        try
        {
          let response = await this.userService.deleteUser(this.deleteUserForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Deleted");
              this.commonSharedService.userListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.deleteClicked = false;
        }
      }
      else
      {
        this.deleteClicked = false;
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
