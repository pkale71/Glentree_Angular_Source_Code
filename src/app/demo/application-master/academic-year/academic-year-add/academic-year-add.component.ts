import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';

// third party
import { TextMaskModule } from 'angular2-text-mask';

@Component({
  selector: 'app-academic-year-add',
  standalone: true,
  imports: [CommonModule, SharedModule, TextMaskModule],
  templateUrl: './academic-year-add.component.html',
  styleUrls: ['./academic-year-add.component.scss']
})
export class AcademicYearAddComponent {
  @Input() public modalParams;
  addAcademicYearForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  maskAcademicYear = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

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

    this.addAcademicYearForm = this.formbuilder.group({
      uuid:[''],
      year: ['',Validators.required],
      startDate: ['', Validators.required],
      endDate: ['',Validators.required]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getCurrentAcademicYear()
  {
    let response = await this.commonService.getCurrentAcademicYear().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.commonSharedService.currentAcademicYear = response.data.currentAcademicYear;
      this.commonSharedService.currentAcademicYearListObject.next({result : "success"});
    }
  }

  async saveAcademicYear()
  {
    if(!this.saveClicked)
    {
      if(this.addAcademicYearForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        let startDate = this.addAcademicYearForm.get("startDate").value;
        startDate = startDate.year + "-" + (startDate.month < 10 ? '0' + startDate.month : startDate.month) + "-" + (startDate.day < 10 ? '0' + startDate.day : startDate.day);
        this.addAcademicYearForm.get("startDate").setValue(startDate);

        let endDate = this.addAcademicYearForm.get("endDate").value;
        endDate = endDate.year + "-" + (endDate.month < 10 ? '0' + endDate.month : endDate.month) + "-" + (endDate.day < 10 ? '0' + endDate.day : endDate.day);
        this.addAcademicYearForm.get("endDate").setValue(endDate);
        
        try
        {
          let response = await this.commonService.saveAcademicYear(this.addAcademicYearForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Academic Year Created");
              this.getCurrentAcademicYear();
              this.commonSharedService.academicYearListObject.next({result : "success"});
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
