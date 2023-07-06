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
import { Router } from '@angular/router';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { User } from 'src/app/theme/shared/model/user';
import { SchoolService } from 'src/app/theme/shared/service/school.service';

// third party
import Swal from 'sweetalert2';

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
  selectedSchools : School[];
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
    private router : Router,
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
    this.selectedSchools = [];
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
      schools: ['']
    });

    this.roleForm = this.formbuilder.group({
      'role': ['', [Validators.required]]
    });

    this.userTypeForm = this.formbuilder.group({
      'userType': ['', [Validators.required]]
    });

    this.schoolForm = this.formbuilder.group({
      'school': ['', Validators.required]
    });
///Get User
    this.getUserRoles();
    this.getUserTypes();
    if(this.commonSharedService.loginUser.userType.code == 'SUADM')
    {
      this.getSchools();
    }
    else
    {
      this.schools = JSON.parse(JSON.stringify(this.commonSharedService.loginUser.schools));
    }
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

  applySchool()
  {
    /////
    let schoolUUID : string = this.schoolForm.get("school").value;
    let roleId : number = this.roleForm.get("role").value;
    if(schoolUUID != "" && roleId > 0)
    {
      if(this.selectedSchools.length > 0)
      {
        if(roleId == 2 && this.selectedSchools.length == 1)
        {
          this.showNotification("info", "School role user mapped with one school only");
        }
        else
        {
          //check data exist in the table
          let existSchool : School[] = this.selectedSchools.filter(selectedSchool => selectedSchool.uuid == schoolUUID);
          if(existSchool.length == 0)
          {
            let tempSchool : School[] = this.schools.filter(school => school.uuid == schoolUUID);
            this.selectedSchools.push(tempSchool[0]);
            this.schoolForm.get("school").setValue("");
          }
          else
          {
            this.showNotification("warning", "School already in the list")
          }
        }
      }
      else
      {
        let tempSchool : School[] = this.schools.filter(school => school.uuid == schoolUUID);
        this.selectedSchools.push(tempSchool[0]);
        this.schoolForm.get("school").setValue("");
      }
    }
    else
    {
      this.showNotification("warning", "Select user role & school");
    }
  }

  deleteSchool(index : number)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete school?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
        
      } else {
        this.selectedSchools.splice(index,1);
        this.showNotification('info', "School Deleted");
      }
    });    
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
      this.roleForm.get('role').disable();
      this.filterUserTypes(this.user.role.id);
      this.selectedSchools = this.user.schools;
      if(this.user.userTypeExist == 1)
      {
        this.userTypeForm.get('userType').disable();
      }
    }
  }

  filterUserTypes(roleId : number)
  {
    this.selectedSchools = [];
    if(roleId > 0)
    {
      this.userTypes = this.masterUserTypes.filter(userType => userType.role.id == roleId);
    }
    else
    {
      this.userTypes = [];
    }
  }

  getSelectedSchools()
  {
    let schools : string = "";
    for(let i=0;i<this.selectedSchools.length;i++)
    {
      if(schools == "")
      {
        schools = this.selectedSchools[i].uuid;
      }
      else
      {
        schools = schools + "," + this.selectedSchools[i].uuid;
      }
    }
    return schools;
  }

  async saveUser()
  {
    if(!this.saveClicked)
    {
      let checkSchoolManditory : boolean = false;
      this.roleForm.get('role').enable();
      if(this.user.userTypeExist == 1)
      {
        this.userTypeForm.get('userType').enable();
      }
      checkSchoolManditory = this.schoolForm.get('school').hasValidator(Validators.required);
      if(this.editUserForm.valid && this.roleForm.valid && this.userTypeForm.valid)
      {
        if(this.selectedSchools.length > 0)
        {
          this.isValidForm = true;
          this.saveClicked = true;
          this.editUserForm.controls["role"].get("id").setValue(this.roleForm.get("role").value);
          this.editUserForm.controls["userType"].get("id").setValue(this.userTypeForm.get("userType").value);
          this.editUserForm.get("schools").setValue(this.getSelectedSchools());
          try
          {
            this.roleForm.get('role').disable();
            if(this.user.userTypeExist == 1)
            {
              this.userTypeForm.get('userType').disable();
            }
            let response = await this.userService.updateUser(this.editUserForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "User Updated");
                this.closeModal();
                this.router.navigateByUrl("/user/detail/" + this.user.uuid);
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
          this.showNotification("info", "No School Mapped");
        }
      }
      else
      {
        this.isValidForm = false;
        this.saveClicked = false;
        this.roleForm.get('role').disable();
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
