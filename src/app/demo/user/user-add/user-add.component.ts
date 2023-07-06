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
import { SchoolService } from 'src/app/theme/shared/service/school.service';

// third party
import Swal from 'sweetalert2';

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
  selectedSchools : School[];
  addUserForm: FormGroup;
  roleForm: FormGroup;
  userTypeForm: FormGroup;
  schoolForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(
    private router : Router,
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
    this.isValidForm = true;
    this.saveClicked = false;
    this.roles = [];
    this.userTypes = [];
    this.schools = [];
    this.selectedSchools = [];
    this.addUserForm = this.formbuilder.group({
      uuid:[''],
      firstName: ['',[Validators.pattern('^[a-zA-Z ]*$'), Validators.required]],
      lastName: ['',Validators.pattern('^[a-zA-Z ]*$')],
      gender: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      mobile: ['',[Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      role: this.formbuilder.group({ 'id': [''] }),
      userType: this.formbuilder.group({ 'id': [''] }),
      schools: [''],
      password: ['',[Validators.required,Validators.minLength(6)]],
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
      if(this.addUserForm.valid && this.roleForm.valid && this.userTypeForm.valid)
      {
        if(this.selectedSchools.length > 0)
        {
          this.isValidForm = true;
          this.saveClicked = true;
          this.addUserForm.controls["role"].get("id").setValue(this.roleForm.get("role").value);
          this.addUserForm.controls["userType"].get("id").setValue(this.userTypeForm.get("userType").value);
          this.addUserForm.get("schools").setValue(this.getSelectedSchools());
          try
          {
            let response = await this.userService.saveUser(this.addUserForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "User Created");
                this.closeModal();
                this.router.navigateByUrl("/user/detail/" + response.data.uuid);
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
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
