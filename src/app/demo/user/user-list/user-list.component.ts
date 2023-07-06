import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/theme/shared/model/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Role } from 'src/app/theme/shared/model/role';
import { UserType } from 'src/app/theme/shared/model/userType';
import { School } from 'src/app/theme/shared/model/school';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent 
{
  users : User[];
  masterUsers : User[];
  roles : Role[];
  masterUserTypes : UserType[];
  userTypes : UserType[];
  schools : School[];
  roleForm : FormGroup;
  userTypeForm : FormGroup;
  schoolForm : FormGroup;
  searchClicked : boolean;
  
  constructor(private router : Router,
    private formbuilder : FormBuilder,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UserService, 
    private schoolService : SchoolService,
    private commonService : CommonService,
    public commonSharedService : CommonSharedService)
  {
    this.masterUsers = this.activatedRoute.snapshot.data['users'].data.users;
    this.users = this.masterUsers;
  }
  
  ngOnInit() 
  {
    this.searchClicked = false;
    this.userTypes = [];
    this.roleForm = this.formbuilder.group({
      'role': ['']
    });
    this.userTypeForm = this.formbuilder.group({
      'userType': ['']
    });

    this.schoolForm = this.formbuilder.group({
      'school': ['']
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
      let tempSchool : School = new School();
      tempSchool.id = 0;
      tempSchool.uuid = "";
      tempSchool.name = "All";
      this.schools.unshift(tempSchool);
      this.schoolForm.get("school").setValue("");
    }
  }

  public userAddResult:any = this.commonSharedService.userListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getUsers();
    }
  })

  async getUserRoles() 
  {
    let response = await this.commonService.getUserRoles().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.roles = response.data.roles;
      let tempRole : Role = new Role();
      tempRole.id = 0;
      tempRole.name = "All";
      this.roles.unshift(tempRole);
      this.roleForm.get("role").setValue("0");
    }
  }

  async getUserTypes() 
  {
    let response = await this.commonService.getUserTypes().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.masterUserTypes = response.data.userTypes;
      this.userTypes = this.masterUserTypes;
    }
    let tempUserType : UserType = new UserType();
    tempUserType.id = 0;
    tempUserType.name = "All";
    this.userTypes.unshift(tempUserType);
    this.userTypeForm.get("userType").setValue("0");
  }

  filterUserTypes(roleId : number)
  {
    if(roleId > 0)
    {
      this.userTypes = this.masterUserTypes.filter(userType => userType.role?.id == roleId);
      let tempUserType : UserType = new UserType();
      tempUserType.id = 0;
      tempUserType.name = "All";
      this.userTypes.unshift(tempUserType);
      this.userTypeForm.get("userType").setValue("0");
    }
    else
    {
      this.userTypes = [];
      this.userTypes = this.masterUserTypes;
    }
  }

  async getSchools() 
  {
    let response = await this.schoolService.getSchools().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.schools = response.data.schools;
      let tempSchool : School = new School();
      tempSchool.id = 0;
      tempSchool.uuid = "";
      tempSchool.name = "All";
      this.schools.unshift(tempSchool);
      this.schoolForm.get("school").setValue("");
    }
  }

  async getUsers() 
  {
    let roleId : number = this.roleForm.get("role").value;
    let userTypeId : number = this.userTypeForm.get("userType").value;
    let schoolUUID : string = this.schoolForm.get("school").value;    
    this.searchClicked = true;
    let response = await this.userService.getUsers(roleId, userTypeId, schoolUUID).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblUser').DataTable().clear().destroy();
      this.masterUsers = response.data.users;
      this.users = this.masterUsers;
      setTimeout(function(){
        $('#tblUser').DataTable();
      },800);
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
    else
    {
      this.users = [];
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  changeStatus(uuid : string, status : number)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (status == 1 ? 'deactive' : 'active') + ' the user?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          this.showNotification("info", "Please wait...");
          let response = await this.userService.changeStatus(uuid).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Status Updated");
              this.commonSharedService.userListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", "User Status Not Updated");
        }
      }
    });   
  }

  addUser()
  {
    const dialogRef = this.modalService.open(UserAddComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editUser(uuid)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(UserEditComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  detailUser(uuid : string)
  {
    this.router.navigateByUrl("/user/detail/" + uuid);
  }

  deleteUser(uuid)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(UserDeleteComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }
}
