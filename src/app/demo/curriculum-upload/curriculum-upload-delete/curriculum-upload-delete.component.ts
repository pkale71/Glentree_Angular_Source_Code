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
  selector: 'app-curriculum-upload-delete',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './curriculum-upload-delete.component.html',
  styleUrls: ['./curriculum-upload-delete.component.scss']
})
export class CurriculumUploadDeleteComponent {
  @Input() public modalParams;
  uuid : string;
  deleteClicked : boolean;
  deleteCurriculumUploadForm : FormGroup;

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
    this.deleteClicked = false;
    /////

    this.deleteCurriculumUploadForm = this.formbuilder.group({
      'uuid': [this.uuid, [Validators.required]]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async deleteCurriculumUpload()
  {
    if(!this.deleteClicked)
    {
      if(this.deleteCurriculumUploadForm.valid)
      {
        this.deleteClicked = true;
        try
        {
          let response = await this.curriculumService.deleteCurriculumUpload(this.deleteCurriculumUploadForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Curriculum Upload Deleted");
              this.commonSharedService.curriculumUploadListObject.next({result : "success"});
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
