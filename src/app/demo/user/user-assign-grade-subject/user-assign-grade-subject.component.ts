import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { UserService } from 'src/app/theme/shared/service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { IOption, SelectModule } from 'ng-select';
import { Router } from '@angular/router';
import { Grade } from 'src/app/theme/shared/model/grade';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SchoolService } from 'src/app/theme/shared/service/school.service';

@Component({
  selector: 'app-user-assign-grade-subject',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './user-assign-grade-subject.component.html',
  styleUrls: ['./user-assign-grade-subject.component.scss']
})
export class UserAssignGradeSubjectComponent {
  @Input() public modalParams;
  subjects : Array<IOption>;
  gradeCategories : GradeCategory[];
  grades : Grade[];
  academicYear : AcademicYear;
  assignSubjectForm: FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  schoolUUID : string;
  userUUID : string;
  isGradeListed : boolean;
  isSubjectListed : boolean;

  constructor(private commonService: CommonService, 
    private userService: UserService, 
    private schoolService : SchoolService,
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
  }
  ngOnInit() 
  {
    this.isGradeListed = false;
    this.isSubjectListed = false;
    //get Modal params
    this.userUUID = this.modalParams.userUUID;
    this.schoolUUID = this.modalParams.schoolUUID;
    /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.grades = [];
    this.gradeCategories = [];

    this.assignSubjectForm = this.formbuilder.group({
      uuid:[''],
      user: this.formbuilder.group({ 'uuid': [this.userUUID, Validators.required] }),
      school: this.formbuilder.group({ 'uuid': [this.schoolUUID, Validators.required] }),
      grade: this.formbuilder.group({ 'id': [this.schoolUUID, Validators.required] }),
      academicYear: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      gradeSubject: ['']
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', [Validators.required]]
    });

    this.subjectForm = this.formbuilder.group({
      'subject': ['', [Validators.required]]
    });

    this.getCurrentAcademicYear();
    this.getGradeCategories();
    this.getGrades();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getGradeCategories() 
  {
    let response = await this.schoolService.getSchoolGradeCategories(this.schoolUUID).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.gradeCategories = response.data.gradeCategories;
    }
  }

  async getGrades() 
  {
    this.grades = []; 
    this.subjects = [];
    this.subjectForm.get("subject").setValue("");
    let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
    if(gradeCategoryId > 0)
    {
      this.isGradeListed = true;
      let response = await this.commonService.getGrades(gradeCategoryId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.grades = response.data.grades;
        this.isGradeListed = false;
      }
    }
  }
  
  async getCurrentAcademicYear() 
  {
    let response = await this.commonService.getCurrentAcademicYear().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.academicYear = response.data.currentAcademicYear;
      this.assignSubjectForm.controls["academicYear"].get("uuid").setValue(this.academicYear.uuid);
    }
  }

  async getUnassignedGradeSubjects() 
  {
    this.subjects = [];
    this.subjectForm.get("subject").setValue("");
    let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
    let gradeId : number = this.gradeForm.get("grade").value;
    if(this.academicYear.uuid != null && this.schoolUUID != "" && gradeCategoryId > 0 && gradeId > 0)
    {
      this.isSubjectListed = true;
      let tempSubjects : Array<IOption> = [];
      let response = await this.userService.getUnassignedGradeSubjects(this.academicYear.uuid, this.schoolUUID, gradeCategoryId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        let subjects : SyllabusGradeSubject[] = response.data.unassignedGradeSubjects;
        for(let i=0;i<subjects.length;i++)
        {
          tempSubjects.push({
              "value" : subjects[i].uuid.toString(),
              "label": subjects[i].name
          })
        }
        this.subjects = this.commonSharedService.prepareSelectOptions(tempSubjects);
        this.isSubjectListed = false;
      }
    }
    else
    {
      this.showNotification("info", "Select Grade Category And Grade");
    }
  }

  async saveAssignedSubject()
  {
    if(!this.saveClicked)
    {
      if(this.assignSubjectForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.subjectForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.assignSubjectForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
        this.assignSubjectForm.get("gradeSubject").setValue(this.subjectForm.get("subject").value.toString());
        try
        {
          let response = await this.userService.saveUserAssignGradeSubject(this.assignSubjectForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Subjects Assigned");
              this.saveClicked = false;
              this.closeModal();
              this.commonSharedService.userAssignedGradeSubjectListObject.next({
                academicYearUUID : this.academicYear.uuid,
                userUUID : this.userUUID,
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
