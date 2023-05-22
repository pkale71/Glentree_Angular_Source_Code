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
  selector: 'app-grade-delete',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-delete.component.html',
  styleUrls: ['./grade-delete.component.scss']
})
export class GradeDeleteComponent {
  @Input() public modalParams;
  id : number;
  deleteClicked : boolean;
  deleteGradeForm : FormGroup;

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
    this.id = this.modalParams.id;
    this.deleteClicked = false;
    /////

    this.deleteGradeForm = this.formbuilder.group({
      'id': [this.id, [Validators.required]]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async deleteGrade()
  {
    if(!this.deleteClicked)
    {
      if(this.deleteGradeForm.valid)
      {
        this.deleteClicked = true;
        try
        {
          let response = await this.commonService.deleteGrade(this.deleteGradeForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Deleted");
              this.commonSharedService.gradeListObject.next({result : "success"});
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
