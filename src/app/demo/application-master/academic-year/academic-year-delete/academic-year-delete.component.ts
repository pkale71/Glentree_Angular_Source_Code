import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-academic-year-delete',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './academic-year-delete.component.html',
  styleUrls: ['./academic-year-delete.component.scss']
})
export class AcademicYearDeleteComponent {
  @Input() public modalParams;
  uuid : string;
  deleteClicked : boolean;
  deleteAcademicYearForm : FormGroup;

  constructor(
    private commonService: CommonService, 
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

    this.deleteAcademicYearForm = this.formbuilder.group({
      'uuid': [this.uuid, [Validators.required]]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async deleteAcademicYear()
  {
    if(!this.deleteClicked)
    {
      if(this.deleteAcademicYearForm.valid)
      {
        this.deleteClicked = true;
        try
        {
          let response = await this.commonService.deleteAcademicYear(this.deleteAcademicYearForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Academic Year Deleted");
              this.commonSharedService.academicYearListObject.next({result : "success"});
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
