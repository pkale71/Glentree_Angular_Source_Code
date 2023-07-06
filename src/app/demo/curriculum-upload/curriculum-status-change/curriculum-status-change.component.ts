import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CurriculumService } from 'src/app/theme/shared/service/curriculum.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-curriculum-status-change',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './curriculum-status-change.component.html',
  styleUrls: ['./curriculum-status-change.component.scss']
})
export class CurriculumStatusChangeComponent {
  @Input() public modalParams;
  uuid : string;
  status : string;
  fileName : string;
  changedStatus : string;
  changeStatusClicked : boolean;
  changeCurriculumStatusForm : FormGroup;

  constructor(
    private curriculumService: CurriculumService, 
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
    this.status = this.modalParams.status;
    this.fileName = this.modalParams.fileName;
    this.changedStatus = this.modalParams.changedStatus;
    this.changeStatusClicked = false;
    /////

    this.changeCurriculumStatusForm = this.formbuilder.group({
      'uuid': [this.uuid, [Validators.required]],
      'status': [this.changedStatus, [Validators.required]]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async changeCurriculumStatus()
  {
    if(!this.changeStatusClicked)
    {
      if(this.changeCurriculumStatusForm.valid)
      {
        this.changeStatusClicked = true;
        try
        {
          let response = await this.curriculumService.changeStatus(this.changeCurriculumStatusForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Curriculum Upload Status Changed");
              this.commonSharedService.curriculumUploadListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.changeStatusClicked = false;
        }
      }
      else
      {
        this.changeStatusClicked = false;
      }
    }
  }

  async rejectCurriculum()
  {
    if(!this.changeStatusClicked)
    {
      if(this.changeCurriculumStatusForm.valid)
      {
        this.changeStatusClicked = true;
        try
        {
          this.changeCurriculumStatusForm.get("status").setValue("Rejected");
          let response = await this.curriculumService.changeStatus(this.changeCurriculumStatusForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Curriculum Upload Status Changed");
              this.commonSharedService.curriculumUploadListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.changeStatusClicked = false;
        }
      }
      else
      {
        this.changeStatusClicked = false;
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
