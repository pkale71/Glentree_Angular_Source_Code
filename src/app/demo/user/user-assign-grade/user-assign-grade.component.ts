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
import { SchoolService } from 'src/app/theme/shared/service/school.service';

@Component({
  selector: 'app-user-assign-grade',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './user-assign-grade.component.html',
  styleUrls: ['./user-assign-grade.component.scss']
})
export class UserAssignGradeComponent {
  @Input() public modalParams;
  grades : Array<IOption>;
  gradeCategories : GradeCategory[];
  academicYear : AcademicYear;
  assignGradeForm: FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  schoolUUID : string;
  userUUID : string;
  isGradeListed : boolean;

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
    //get Modal params
    this.userUUID = this.modalParams.userUUID;
    this.schoolUUID = this.modalParams.schoolUUID;
    /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.grades = [];
    this.gradeCategories = [];

    this.assignGradeForm = this.formbuilder.group({
      uuid:[''],
      user: this.formbuilder.group({ 'uuid': [this.userUUID, Validators.required] }),
      school: this.formbuilder.group({ 'uuid': [this.schoolUUID, Validators.required] }),
      academicYear: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      grade: ['']
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', [Validators.required]]
    });

    this.getCurrentAcademicYear();
    this.getGradeCategories();
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
  
  async getCurrentAcademicYear() 
  {
    let response = await this.commonService.getCurrentAcademicYear().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.academicYear = response.data.currentAcademicYear;
      this.assignGradeForm.controls["academicYear"].get("uuid").setValue(this.academicYear.uuid);
    }
  }

  async getUnassignedGrades() 
  {
    this.grades = [];
    this.gradeForm.get("grade").setValue("");
    let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
    if(this.academicYear.uuid != null && this.schoolUUID != "" && gradeCategoryId > 0)
    {
      this.isGradeListed = true;
      let tempGrades : Array<IOption> = [];
      let response = await this.userService.getUnassignedGrades(this.academicYear.uuid, this.schoolUUID, gradeCategoryId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        let grades : Grade[] = response.data.unassignedGrades;
        for(let i=0;i<grades.length;i++)
        {
          tempGrades.push({
              "value" : grades[i].id.toString(),
              "label": grades[i].name
          })
        }
        this.grades = this.commonSharedService.prepareSelectOptions(tempGrades);
        this.isGradeListed = false;
      }
    }
    else
    {
      this.showNotification("info", "Select Grade Category");
    }
  }

  async saveAssignedGrade()
  {
    if(!this.saveClicked)
    {
      if(this.assignGradeForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.assignGradeForm.get("grade").setValue(this.gradeForm.get("grade").value.toString());
        try
        {
          let response = await this.userService.saveUserAssignGrade(this.assignGradeForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grades Assigned");
              this.saveClicked = false;
              this.commonSharedService.userAssignedGradeListObject.next({
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
