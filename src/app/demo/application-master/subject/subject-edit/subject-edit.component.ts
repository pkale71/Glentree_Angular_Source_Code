import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Syllabus } from 'src/app/theme/shared/model/syllabus';
import { Router } from '@angular/router';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';

@Component({
  selector: 'app-subject-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './subject-edit.component.html',
  styleUrls: ['./subject-edit.component.scss']
})
export class SubjectEditComponent {
  @Input() public modalParams;
  syllabuses : Syllabus[];
  subject : SyllabusGradeSubject;
  editSubjectForm: FormGroup;
  syllabusForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  gradeId : number;
  gradeName : string;
  uuid : string;

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
    //get Modal params
    this.uuid = this.modalParams.uuid;
    this.gradeId = this.modalParams.id;
    this.gradeName = this.modalParams.gradeName;
    /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.syllabuses = [];

    this.editSubjectForm = this.formbuilder.group({
      uuid:[this.uuid, Validators.required],
      name: ['',Validators.required],
      syllabus: this.formbuilder.group({ 'id': [''] }),
      grade: this.formbuilder.group({ 'id': [this.gradeId] }),
    });

    this.syllabusForm = this.formbuilder.group({
      'syllabus': ['', [Validators.required]]
    });

    this.getSyllabuses();
    this.getSubject(this.uuid);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSyllabuses() 
  {
    /////////get Syllabuses
    let response = await this.commonService.getSyllabuses().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.syllabuses = response.data.syllabuses;
    }
  }

  async getSubject(uuid : string) 
  {
    let response = await this.commonService.getGradeSubject(uuid).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.subject = response.data.gradeSubject;
      this.editSubjectForm.patchValue(this.subject);
      this.syllabusForm.get("syllabus").setValue(this.subject.syllabus.id);
    }
  }

  async saveSubject()
  {
    if(!this.saveClicked)
    {
      if(this.gradeId > 0 && this.editSubjectForm.valid && this.syllabusForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        this.editSubjectForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
       
        try
        {
          let response = await this.commonService.updateGradeSubject(this.editSubjectForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Subject Saved");
              localStorage.setItem("SYLLABUS_ID", this.syllabusForm.get("syllabus").value);
              this.commonSharedService.subjectListObject.next({
                syllabusId : this.syllabusForm.get("syllabus").value,
                result : "success"
              });
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
