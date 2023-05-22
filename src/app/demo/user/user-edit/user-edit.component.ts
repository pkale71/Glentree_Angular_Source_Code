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
import { User } from 'src/app/theme/shared/model/user';
import { SchoolService } from 'src/app/theme/shared/service/school.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
  @Input() public modalParams;
  user : User;
  uuid : string;
  roles : Role[];
  userTypes : UserType[];
  masterUserTypes : UserType[];
  schools : School[];
  editUserForm: FormGroup;
  roleForm: FormGroup;
  userTypeForm: FormGroup;
  schoolForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

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
    //get Modal params
    this.uuid = this.modalParams.uuid;
    /////
    this.roles = [];
    this.userTypes = [];
    this.masterUserTypes = [];
    this.schools = [];
    this.isValidForm = true;
    this.saveClicked = false;
    this.editUserForm = this.formbuilder.group({
      uuid:['', [Validators.required]],
      firstName: ['',[Validators.pattern('^[a-zA-Z ]*$'), Validators.required]],
      lastName: ['',[Validators.pattern('^[a-zA-Z ]*$')]],
      gender: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      mobile: ['',[Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      role: this.formbuilder.group({ 'id': [''] }),
      userType: this.formbuilder.group({ 'id': [''] }),
      school: this.formbuilder.group({ 'uuid': [''] })
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
///Get User
    this.getUserRoles();
    this.getUserTypes();
    this.getSchools();
    this.getUser(this.uuid);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
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

  async checkDuplicateEmailMobile(checkFor : string, value : string) 
  {
    let data = {
          "checkFor" : checkFor,
          "value" : value,
          "uuid"  :  this.editUserForm.get("uuid").value
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
        this.editUserForm.get("email").setValue(this.user.email);
      }
      else if(checkFor == "Mobile")
      {
        this.editUserForm.get("mobile").setValue(this.user.mobile);
      }
    }
  }
  
  async getUser(uuid) 
  {
    let response = await this.userService.getUser(uuid).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.user = response.data.user;
      this.editUserForm.patchValue(this.user);
      this.roleForm.get("role").setValue(this.user.role.id);
      this.userTypeForm.get("userType").setValue(this.user.userType.id);
      this.checkSchoolRequired(this.user.role.id);
      this.schoolForm.get("school").setValue(this.user.school?.uuid);
      this.roleForm.get('role').disable();
    }
  }

  checkSchoolRequired(roleId: number)
  {
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
          this.schoolForm.get('school').updateValueAndValidity();
        }
        else
        {
          this.schoolForm.get('school').setValue("");
          this.schoolForm.get('school').disable();
          this.schoolForm.get('school').clearValidators();
          this.schoolForm.get('school').updateValueAndValidity();
        }
      }
      else
      {
        this.schoolForm.get('school').setValue("");
        this.schoolForm.get('school').disable();
        this.schoolForm.get('school').clearValidators();
        this.schoolForm.get('school').updateValueAndValidity();
      }
    }
  }

  async saveUser()
  {
    if(!this.saveClicked)
    {
      let checkSchoolManditory : boolean = false;
      this.roleForm.get('role').enable();
      this.schoolForm.get('school').enable();
      checkSchoolManditory = this.schoolForm.get('school').hasValidator(Validators.required);
      if(this.editUserForm.valid && this.roleForm.valid && this.userTypeForm.valid && ((checkSchoolManditory && this.schoolForm.valid) || !checkSchoolManditory))
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.editUserForm.controls["role"].get("id").setValue(this.roleForm.get("role").value);
        this.editUserForm.controls["userType"].get("id").setValue(this.userTypeForm.get("userType").value);
        if(checkSchoolManditory)
        {
          this.editUserForm.controls["school"].get("uuid").setValue(this.schoolForm.get("school").value);
        }
        try
        {
          this.roleForm.get('role').disable();
          this.schoolForm.get('school').disable();
          
          let response = await this.userService.updateUser(this.editUserForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Updated");
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
        this.roleForm.get('role').disable();
        this.schoolForm.get('school').disable();
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
