import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Syllabus } from 'src/app/theme/shared/model/syllabus';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { IOption, SelectModule } from 'ng-select';
import { UserType } from 'src/app/theme/shared/model/userType';
import { SchoolUserSetting } from 'src/app/theme/shared/model/school-user-setting';

// third party
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { School } from 'src/app/theme/shared/model/school';

@Component({
  selector: 'app-school-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './school-edit.component.html',
  styleUrls: ['./school-edit.component.scss']
})
export class SchoolEditComponent {
  @Input() public modalParams;
  syllabuses : Syllabus[];
  userTypes : UserType[];
  school : School;
  uuid : string;
  schoolUserSettings : SchoolUserSetting[];
  gradeCategories : Array<IOption>;
  editSchoolForm: FormGroup;
  schoolUserSettingForm: FormGroup;
  syllabusForm: FormGroup;
  userTypeForm: FormGroup;
  gradeCategoryForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

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
    this.uuid = this.modalParams.uuid;
    /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.syllabuses = [];
    this.schoolUserSettings = [];

    this.editSchoolForm = this.formbuilder.group({
      uuid:['', Validators.required],
      name: ['',Validators.required],
      location: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      contact1: ['',[Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      contact2: ['',[Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      syllabus: this.formbuilder.group({ 'id': [''] }),
      gradeCategory: [''],
      curriculumUpload: ['',[Validators.required]],
      curriculumComplete: ['',[Validators.required]],
      schoolUserSetting : ['']
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });
    
    this.syllabusForm = this.formbuilder.group({
      'syllabus': ['', [Validators.required]]
    });

    this.userTypeForm = this.formbuilder.group({
      'userType': ['']
    });

    this.schoolUserSettingForm = this.formbuilder.group({
      'canUpload': [''],
      'canVerify': [''],
      'canPublish': [''],
    });

    this.getSyllabuses();
    this.getGradeCategories();
    this.getUserTypes();
    this.getSchool(this.uuid);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSyllabuses() 
  {
    let response = await this.commonService.getSyllabuses().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.syllabuses = response.data.syllabuses;
    }
  }

  async getUserTypes() 
  {
    let response = await this.commonService.getUserTypes().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.userTypes = response.data.userTypes.filter(userType => userType.role.id == 2);
    }
  }

  async getGradeCategories() 
  {
    /////////get Grade Categories
    let tempGradeCategories : Array<IOption> = [];
    let response = await this.commonService.getGradeCategories().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      let gradeCategories : GradeCategory[] = response.data.gradeCategories;
      for(let i=0;i<gradeCategories.length;i++)
      {
        tempGradeCategories.push({
            "value" : gradeCategories[i].id.toString(),
            "label": gradeCategories[i].name
        })
      }
      this.gradeCategories = this.commonSharedService.prepareSelectOptions(tempGradeCategories);
    }
  }

  async getSchool(uuid : string) 
  {
    let response = await this.schoolService.getSchool(uuid).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.school = response.data.school;
      this.editSchoolForm.patchValue(this.school);
      this.syllabusForm.get("syllabus").setValue(this.school.syllabus.id);
      this.schoolUserSettings = this.school.schoolUserSetting;
      let gradeCategories : string[] = [];
      for(let i=0;i<this.school.gradeCategories.length;i++)
      {
        gradeCategories.push(this.school.gradeCategories[i].gradeCategory.id.toString());
      }
      this.gradeCategoryForm.get("gradeCategory").setValue(gradeCategories);
      if(this.school.curriculumExist == 1)
      {
        this.editSchoolForm.get("curriculumUpload").disable();
      }
      if(this.school.curriculumCompleteExist == 1)
      {
        this.editSchoolForm.get("curriculumComplete").disable();
      }
      if(this.school.isExist == 1)
      { 
        this.syllabusForm.get("syllabus").disable();
      }
    }
  }

  applySetting()
  {
    /////
    let userTypeId : number = this.userTypeForm.get("userType").value ? this.userTypeForm.get("userType").value : 0;
    let canUpload : number = this.schoolUserSettingForm.get("canUpload").value === true ? 1 : 0;
    let canVerify : number = this.schoolUserSettingForm.get("canVerify").value === true ? 1 : 0;
    let canPublish : number = this.schoolUserSettingForm.get("canPublish").value === true ? 1 : 0;
    
    if(userTypeId > 0 && (canUpload > 0 || canVerify > 0 || canPublish > 0))
    {
      if(this.schoolUserSettings.length > 0)
      {
      //check data exist in the table
        let existUserType : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.userType.id == userTypeId);
        let existCanUpload : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.canUpload == canUpload && canUpload > 0);
        let existCanVerify : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.canVerify == canVerify && canVerify > 0);
        let existCanPublish : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.canPublish == canPublish && canPublish > 0);
        if(existUserType.length == 0 && existCanUpload.length == 0 && existCanVerify.length == 0 && existCanPublish.length == 0)
        {
          let schoolUserSettingJSON : SchoolUserSetting = new SchoolUserSetting();
          let tempUserType : UserType[] = this.userTypes.filter(userType => userType.id == userTypeId);
          schoolUserSettingJSON.userType = tempUserType[0];
          schoolUserSettingJSON.canUpload = canUpload;
          schoolUserSettingJSON.canVerify = canVerify;
          schoolUserSettingJSON.canPublish = canPublish;

          this.schoolUserSettings.push(schoolUserSettingJSON);
        }
        else
        {
          if(existUserType.length > 0)
          {
            this.showNotification("warning", "User Type Already Exist In The Setting");
          }
          if(existCanUpload.length > 0)
          {
            this.showNotification("warning", "Can Upload Already Exist In The Setting");
          }
          if(existCanVerify.length > 0)
          {
            this.showNotification("warning", "Can Verify Already Exist In The Setting");
          }
          if(existCanPublish.length > 0)
          {
            this.showNotification("warning", "Can Publish Already Exist In The Setting");
          }
        }
      }
      else
      {
        let schoolUserSettingJSON : SchoolUserSetting = new SchoolUserSetting();
        let tempUserType : UserType[] = this.userTypes.filter(userType => userType.id == userTypeId);
        schoolUserSettingJSON.userType = tempUserType[0];
        schoolUserSettingJSON.canUpload = canUpload;
        schoolUserSettingJSON.canVerify = canVerify;
        schoolUserSettingJSON.canPublish = canPublish;

        this.schoolUserSettings.push(schoolUserSettingJSON);
      }
    }
    else
    {
      if(userTypeId == 0)
      {
        this.showNotification("warning", "Select User Type");        
      }
      if(canUpload == 0 && canVerify == 0 && canPublish == 0)
      {
        this.showNotification("warning", "Select Any One From [Can Upload, Can Verify, Can Publish]");        
      }
    }
  }

  deleteSchoolUserSetting(index : number)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete curriculum user setting?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
        
      } else {
        this.schoolUserSettings.splice(index,1);
        this.showNotification('info', "Curriculum User Setting Deleted");
      }
    });    
  }

  async saveSchool()
  {
    if(!this.saveClicked)
    {
      this.editSchoolForm.get("curriculumUpload").enable();
      this.editSchoolForm.get("curriculumComplete").enable();
      this.syllabusForm.get("syllabus").enable();
      if(this.editSchoolForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        
        this.editSchoolForm.get("gradeCategory").setValue(this.gradeCategoryForm.get("gradeCategory").value.toString());
        this.editSchoolForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
       
        if(this.schoolUserSettings.length > 0)
        {
          this.editSchoolForm.get("schoolUserSetting").setValue(this.schoolUserSettings);
        }
        try
        {
          let response = await this.schoolService.updateSchool(this.editSchoolForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.editSchoolForm.get("curriculumUpload").disable();
              this.syllabusForm.get("syllabus").disable();
              this.showNotification("success", "School Saved");
              this.closeModal();
              this.router.navigateByUrl("/school/detail/" + this.uuid);
          }
        }
        catch(e)
        {
          this.editSchoolForm.get("curriculumUpload").disable();
          this.editSchoolForm.get("curriculumComplete").disable();
          this.syllabusForm.get("syllabus").disable();
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
