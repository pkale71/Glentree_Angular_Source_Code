import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/theme/shared/model/role';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { UserType } from 'src/app/theme/shared/model/userType';
import { School } from 'src/app/theme/shared/model/school';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent {
  @Input() public modalParams;
  roles : Role[];
  userTypes : UserType[];
  masterUserTypes : UserType[];
  schools : School[];
  addUserForm: FormGroup;
  roleForm: FormGroup;
  userTypeForm: FormGroup;
  schoolForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  checkSchoolManditory : boolean;

  constructor(
    private commonService: CommonService, 
    private userService: UserService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    public schoolService : SchoolService) 
  {
  }
  
  ngOnInit() 
  {
    this.checkSchoolManditory = false;
    this.isValidForm = true;
    this.saveClicked = false;
    this.roles = [];
    this.userTypes = [];
    this.schools = [];
    this.addUserForm = this.formbuilder.group({
      uuid:[''],
      firstName: ['',[Validators.pattern('^[a-zA-Z ]*$'), Validators.required]],
      lastName: ['',Validators.pattern('^[a-zA-Z ]*$')],
      gender: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      mobile: ['',[Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      role: this.formbuilder.group({ 'id': [''] }),
      userType: this.formbuilder.group({ 'id': [''] }),
      school: this.formbuilder.group({ 'uuid': [''] }),
      password: ['',[Validators.required,Validators.minLength(6)]],
    });

    this.roleForm = this.formbuilder.group({
      'role': ['', [Validators.required]]
    });

    this.userTypeForm = this.formbuilder.group({
      'userType': ['', [Validators.required]]
    });

    this.schoolForm = this.formbuilder.group({
      'school': ['']
    });

    this.getUserRoles();
    this.getUserTypes();
    this.getSchools();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }
  
  async checkDuplicateEmailMobile(checkFor : string, value : string) 
  {
    if(value != "")
    {
      let data = {
            "checkFor" : checkFor,
            "value" : value,
            "uuid"  :  ""
      }
      try
      {
        let response = await this.userService.checkDuplicateEmailMobile(data).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
        }
      }
      catch(e)
      {
        this.showNotification("error", e);
        
        if(checkFor == "Email")
        {
          this.addUserForm.get("email").setValue("");
        }
        else if(checkFor == "Mobile")
        {
          this.addUserForm.get("mobile").setValue("");
        }
      }
    }
  }

  checkSchoolRequired(roleId: number)
  {
    this.checkSchoolManditory = false;
    this.userTypes = [];
    if(this.roles.length > 0)
    {
      let filterRoles : Role[] = this.roles.filter(role => role.id == roleId);
      if(filterRoles.length > 0)
      {
        /////Get Role wise User Types
        let filterUserTypes : UserType[] = this.masterUserTypes.filter(userType => userType.role.id == roleId);
        if(filterUserTypes.length > 0)
        {
          this.userTypes = filterUserTypes;
        }
        ///////////////////
        if(filterRoles[0].name == "School")
        {
          if(this.schoolForm.get('school').value != "")
          {
            this.schoolForm.get('school').setValue("");
          }
          this.schoolForm.get('school').enable();
          this.schoolForm.get('school').addValidators(Validators.required);
          this.checkSchoolManditory = true;
          this.schoolForm.get('school').updateValueAndValidity();
        }
        else
        {
          this.schoolForm.get('school').setValue("");
          this.schoolForm.get('school').disable();
          this.schoolForm.get('school').clearValidators();
          this.checkSchoolManditory = false;
          this.schoolForm.get('school').updateValueAndValidity();
        }
      }
      else
      {
        this.schoolForm.get('school').setValue("");
        this.schoolForm.get('school').disable();
        this.schoolForm.get('school').clearValidators();
        this.checkSchoolManditory = false;
        this.schoolForm.get('school').updateValueAndValidity();
      }
    }
  }

  async getUserRoles() 
  {
    let response = await this.commonService.getUserRoles().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.roles = response.data.roles;
    }
  }

  async getUserTypes() 
  {
    let response = await this.commonService.getUserTypes().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.masterUserTypes = response.data.userTypes;
    }
  }

  async getSchools() 
  {
    let response = await this.schoolService.getSchools().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.schools = response.data.schools;
    }
  }

  async saveUser()
  {
    if(!this.saveClicked)
    {
      if(this.addUserForm.valid && this.roleForm.valid && this.userTypeForm.valid && ((this.checkSchoolManditory && this.schoolForm.valid) || !this.checkSchoolManditory))
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addUserForm.controls["role"].get("id").setValue(this.roleForm.get("role").value);
        this.addUserForm.controls["userType"].get("id").setValue(this.userTypeForm.get("userType").value);
        if(this.checkSchoolManditory)
        {
          this.addUserForm.controls["school"].get("uuid").setValue(this.schoolForm.get("school").value);
        }
        try
        {
          let response = await this.userService.saveUser(this.addUserForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Created");
              this.commonSharedService.userListObject.next({result : "success"});
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
