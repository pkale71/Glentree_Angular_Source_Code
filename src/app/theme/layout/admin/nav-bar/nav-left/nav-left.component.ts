// angular import
import { Component } from '@angular/core';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { User } from 'src/app/theme/shared/model/user';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  currentAcademicYear : AcademicYear;
  loginUser : User;
  schoolLogo : any;
  constructor(private commonSharedService : CommonSharedService, 
    private schoolService : SchoolService)
  {
    this.commonSharedService.currentAcademicYearListObject.next({result : "success"});
    this.loginUser = this.commonSharedService.loginUser;
    if(this.loginUser.role.name == 'School')
    {
        this.getSchoolLogo(this.loginUser.schools[0].uuid);
    }
  }

  public currentAcademicYearResult:any = this.commonSharedService.currentAcademicYearListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.currentAcademicYear = this.commonSharedService.currentAcademicYear;
    }
  })

  async getSchoolLogo(uuid : string) 
  {
    try
    {
      let response = await this.schoolService.getSchoolLogo(uuid).toPromise();
      if (response.status_code == 200) 
      {
        this.schoolLogo = response.data.logoFile;
      }
    }
    catch(e)
    {
      
    }
  }
}
