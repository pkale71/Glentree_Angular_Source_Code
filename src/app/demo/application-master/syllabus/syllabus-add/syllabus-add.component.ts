import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-syllabus-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './syllabus-add.component.html',
  styleUrls: ['./syllabus-add.component.scss']
})
export class SyllabusAddComponent {
  @Input() public modalParams;
  addSyllabusForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
    
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.addSyllabusForm = this.formbuilder.group({
      id:[''],
      name: ['',Validators.required]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveSyllabus()
  {
    if(!this.saveClicked)
    {
      if(this.addSyllabusForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.commonService.saveSyllabus(this.addSyllabusForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Syllabus Saved");
              this.commonSharedService.syllabusListObject.next({result : "success"});
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
