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
import { SchoolGradeSection } from 'src/app/theme/shared/model/school-grade-section';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { School } from 'src/app/theme/shared/model/school';
@Component({
  selector: 'app-user-assign-grade-section',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './user-assign-grade-section.component.html',
  styleUrls: ['./user-assign-grade-section.component.scss']
})
export class UserAssignGradeSectionComponent {
  @Input() public modalParams;
  sections : Array<IOption>;
  grades : Grade[];
  gradeCategories : GradeCategory[];
  subjects : SyllabusGradeSubject[];
  academicYear : AcademicYear;
  assignGradeSectionForm: FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  sectionForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  schoolUUID : string;
  userUUID : string;
  syllabusId : number;
  isGradeListed: boolean;
  isSubjectListed : boolean;
  isSectionListed : boolean;

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
    this.isSectionListed = false;
    //get Modal params
    this.userUUID = this.modalParams.userUUID;
    this.schoolUUID = this.modalParams.schoolUUID;
    /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.grades = [];
    this.gradeCategories = [];

    this.assignGradeSectionForm = this.formbuilder.group({
      uuid:[''],
      user: this.formbuilder.group({ 'uuid': [this.userUUID, Validators.required] }),
      grade: this.formbuilder.group({ 'id': [''] }),
      gradeSubject: this.formbuilder.group({ 'uuid': [''] }),
      school: this.formbuilder.group({ 'uuid': [this.schoolUUID, Validators.required] }),
      academicYear: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      sections: ['']
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

    this.sectionForm = this.formbuilder.group({
      'section': ['', [Validators.required]]
    });

    this.getCurrentAcademicYear();
    this.getGradeCategories();
    this.getSchool(this.schoolUUID);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSchool(schoolUUID : string) 
  {
    let response = await this.schoolService.getSchool(schoolUUID).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      let school : School = response.data.school;
      this.syllabusId = school.syllabus?.id;
    }
  }

  async getGradeCategories() 
  {
    this.gradeCategories = [];
    let response = await this.schoolService.getSchoolGradeCategories(this.schoolUUID).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.gradeCategories = response.data.gradeCategories;
    }
  }

  async getGrades() 
  {
    this.sections = [];
    this.sectionForm.get("section").setValue("");
    let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
    if(gradeCategoryId > 0)
    {
      this.grades = [];
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
      this.assignGradeSectionForm.controls["academicYear"].get("uuid").setValue(this.academicYear.uuid);
    }
  }

  async getSubjects() 
  {
    this.subjects = [];
    this.sections = [];
    this.sectionForm.get("section").setValue("");
    let gradeId = this.gradeForm.get("grade").value;
    if(this.syllabusId > 0 && gradeId > 0)
    {
      this.isSubjectListed = true;
      let response = await this.commonService.getGradeSubjects(this.syllabusId, gradeId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.subjects = response.data.gradeSubjects;
        this.isSubjectListed = false;
      }
    }
  }

  async getUnassignedGradeSections() 
  {
    this.sections = [];
    this.sectionForm.get("section").setValue("");
    let gradeId : number = this.gradeForm.get("grade").value;
    let subjectUUID : string = this.subjectForm.get("subject").value;
    if(this.academicYear.uuid != null && this.schoolUUID != "" && gradeId > 0 && subjectUUID != "")
    {
      this.isSectionListed = true;
      let tempSections : Array<IOption> = [];
      let response = await this.userService.getUnassignedGradeSections(this.academicYear.uuid, gradeId, subjectUUID, this.schoolUUID).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        let sections : SchoolGradeSection[] = response.data.unassignedGradeSubjectSections;
        if(sections)
        {
          for(let i=0;i<sections.length;i++)
          {
            tempSections.push({
                "value" : sections[i].uuid.toString(),
                "label": sections[i].name
            })
          }
        }
        this.sections = this.commonSharedService.prepareSelectOptions(tempSections);
        this.isSectionListed = false;
      }
    }
    else
    {
      this.showNotification("info", "Select Grade And Subject");
    }
  }

  async saveAssignedGradeSection()
  {
    if(!this.saveClicked)
    {
      console.log(this.assignGradeSectionForm.valid+" && "+this.gradeCategoryForm.valid+"  && "+this.gradeForm.valid+"  && "+this.subjectForm.valid+"  && "+this.sectionForm.valid)
      if(this.assignGradeSectionForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.subjectForm.valid && this.sectionForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.assignGradeSectionForm.controls['grade'].get("id").setValue(this.gradeForm.get("grade").value);
        this.assignGradeSectionForm.controls['gradeSubject'].get("uuid").setValue(this.subjectForm.get("subject").value);
        this.assignGradeSectionForm.get("sections").setValue(this.sectionForm.get("section").value.toString());
        try
        {
          let response = await this.userService.saveUserAssignGradeSection(this.assignGradeSectionForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Sections Assigned");
              this.saveClicked = false;
              this.closeModal();
              this.commonSharedService.userAssignedGradeSectionListObject.next({
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
