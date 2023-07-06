import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { School } from 'src/app/theme/shared/model/school';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolAddComponent } from '../school-add/school-add.component';
import { SchoolDeleteComponent } from '../school-delete/school-delete.component';
import { SchoolEditComponent } from '../school-edit/school-edit.component';
declare var $;

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent {
  schools : School[];
  loginUserType : string;

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private modalService: NgbModal,
  private schoolService: SchoolService, 
  public commonSharedService : CommonSharedService,
  private router : Router)
  {
    this.schools = [];
    let schools : School[] = this.activatedRoute.snapshot.data['schools'].data.schools;
    if(this.commonSharedService.loginUser.userType.code != 'SUADM')
    {
      let allocatedSchools : School[] = this.commonSharedService.loginUser.schools;
      for(let i=0;i<schools.length;i++)
      {
        let tempSchools : School[] = allocatedSchools.filter(allocatedSchool => allocatedSchool.uuid == schools[i].uuid)
        if(tempSchools.length > 0)
        {
          this.schools.push(schools[i]);
        }
      }
    }
    else
    {
      this.schools = schools;
    }
  }

  ngOnInit() 
  {
    this.loginUserType = this.commonSharedService.loginUser.userType.code;
  }

  public schoolAddResult:any = this.commonSharedService.schoolListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getSchools();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSchools() 
  {
    let response = await this.schoolService.getSchools().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblSchool').DataTable().clear().destroy();
      this.schools = response.data.schools;
      setTimeout(function(){
        $('#tblSchool').DataTable();
      },1000);
      this.modalService.dismissAll();
    }
    else
    {
      this.schools = [];
      this.modalService.dismissAll();
    }
  }

  addSchool()
  {
    const dialogRef = this.modalService.open(SchoolAddComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  changeStatus(uuid : string, status : number)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (status == 1 ? 'deactive' : 'active') + ' the school?',
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
          let response = await this.schoolService.changeStatus(uuid).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "School Status Updated");
              this.commonSharedService.schoolListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", "School Status Not Updated");
        }
      }
    });   
  }

  detailSchool(uuid : string)
  {
    this.router.navigateByUrl("/school/detail/" + uuid);
  }

  editSchool(uuid)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(SchoolEditComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  deleteSchool(uuid)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(SchoolDeleteComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }
}
