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
@Component({
  selector: 'app-subject-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './subject-add.component.html',
  styleUrls: ['./subject-add.component.scss']
})
export class SubjectAddComponent {
  @Input() public modalParams;
  syllabuses : Syllabus[];
  addSubjectForm: FormGroup;
  syllabusForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  gradeId : number;
  gradeName : string;
  syllabusId : number;

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
    this.gradeId = this.modalParams.id;
    this.gradeName = this.modalParams.gradeName;
    this.syllabusId = this.modalParams.syllabusId;
    /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.syllabuses = [];

    this.addSubjectForm = this.formbuilder.group({
      uuid:[''],
      name: ['',Validators.required],
      syllabus: this.formbuilder.group({ 'id': [''] }),
      grade: this.formbuilder.group({ 'id': [this.gradeId] }),
    });

    this.syllabusForm = this.formbuilder.group({
      'syllabus': [this.syllabusId, [Validators.required]]
    });

    this.getSyllabuses();
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

  async saveSubject()
  {
    if(!this.saveClicked)
    {
      if(this.gradeId > 0 && this.addSubjectForm.valid && this.syllabusForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        this.addSubjectForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
       
        try
        {
          let response = await this.commonService.saveGradeSubject(this.addSubjectForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Subject Created");
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
