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
  selector: 'app-syllabus-delete',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './syllabus-delete.component.html',
  styleUrls: ['./syllabus-delete.component.scss']
})
export class SyllabusDeleteComponent {
  @Input() public modalParams;
  id : number;
  deleteClicked : boolean;
  deleteSyllabusForm : FormGroup;

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

    this.deleteSyllabusForm = this.formbuilder.group({
      'id': [this.id, [Validators.required]]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async deleteSyllabus()
  {
    if(!this.deleteClicked)
    {
      if(this.deleteSyllabusForm.valid)
      {
        this.deleteClicked = true;
        try
        {
          let response = await this.commonService.deleteSyllabus(this.deleteSyllabusForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Syllabus Deleted");
              this.commonSharedService.syllabusListObject.next({result : "success"});
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
