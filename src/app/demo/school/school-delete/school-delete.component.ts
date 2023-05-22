import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-school-delete',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './school-delete.component.html',
  styleUrls: ['./school-delete.component.scss']
})
export class SchoolDeleteComponent {
  @Input() public modalParams;
  uuid : string;
  deleteClicked : boolean;
  deleteSchoolForm : FormGroup;

  constructor(
    private schoolService: SchoolService, 
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

    this.deleteSchoolForm = this.formbuilder.group({
      'uuid': [this.uuid, [Validators.required]]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async deleteSchool()
  {
    if(!this.deleteClicked)
    {
      if(this.deleteSchoolForm.valid)
      {
        this.deleteClicked = true;
        try
        {
          let response = await this.schoolService.deleteSchool(this.deleteSchoolForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "School Deleted");
              this.commonSharedService.schoolListObject.next({result : "success"});
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
