import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { Grade } from 'src/app/theme/shared/model/grade';

// third party
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SchoolService } from 'src/app/theme/shared/service/school.service';

@Component({
  selector: 'app-school-grade-section-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './school-grade-section-add.component.html',
  styleUrls: ['./school-grade-section-add.component.scss']
})
export class SchoolGradeSectionAddComponent 
{
  @Input() public modalParams;
  gradeCategories : GradeCategory[];
  masterGrades : Grade[];
  grades : Grade[];
  academicYears : AcademicYear[];
  addSchoolGradeSectionForm: FormGroup;
  gradeCategoryForm : FormGroup;
  academicYearForm : FormGroup;
  gradeForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  schoolUUID : string;

  constructor(private commonService: CommonService, 
    private schoolService: SchoolService, 
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
     this.schoolUUID = this.modalParams.uuid;
     /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.gradeCategories = [];
    this.masterGrades = [];
    this.grades = [];
    this.academicYears = [];

    this.addSchoolGradeSectionForm = this.formbuilder.group({
      uuid:[''],
      academicYear: this.formbuilder.group({ 'uuid': [''] }),
      school: this.formbuilder.group({ 'uuid': [this.schoolUUID] }),
      grade: this.formbuilder.group({ 'id': [''] }),
      count: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}')]]
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });
    
    this.academicYearForm = this.formbuilder.group({
      'academicYear': ['', [Validators.required]]
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', Validators.required]
    });

    this.getAcademicYears();
    this.getGradeCategories();
    this.getGrades(); 
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicYears() 
  {
    let response = await this.commonService.getAcademicYears().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      let academicYears : AcademicYear[] = response.data.academicYears;
  ///set current academicYear
      for(let i=0;i<academicYears.length;i++)
      {
        if(academicYears[i].isCurrent == 1)
        {
          this.academicYears.push(academicYears[i]);
          this.academicYearForm.get("academicYear").setValue(this.academicYears[i].uuid);
          break;
        }
      }
    }
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
    let response = await this.commonService.getGrades(0).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.masterGrades = response.data.grades;
    }
  }

  filterGrades()
  {
    let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
    if(gradeCategoryId > 0)
    {
      this.grades = this.masterGrades.filter(masterGrade => masterGrade.gradeCategory.id == gradeCategoryId);
    }
    else
    {
      this.grades = [];
    }
  }

  async saveSection()
  {
    if(!this.saveClicked)
    {
      if(this.schoolUUID != "" && this.addSchoolGradeSectionForm.valid && this.academicYearForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        
        this.addSchoolGradeSectionForm.controls["academicYear"].get("uuid").setValue(this.academicYearForm.get("academicYear").value);
        this.addSchoolGradeSectionForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value.toString());
        try
        {
          let response = await this.schoolService.saveSchoolGradeSection(this.addSchoolGradeSectionForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Sections Created");
              this.commonSharedService.schoolGradeSectionListObject.next({
                academicYearUUID : this.academicYearForm.get("academicYear").value,
                gradeCategoryId : this.gradeCategoryForm.get("gradeCategory").value,
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
