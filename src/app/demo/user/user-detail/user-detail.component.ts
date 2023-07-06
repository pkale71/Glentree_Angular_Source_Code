import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/theme/shared/model/user';

// third party
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserAssignGradeComponent } from '../user-assign-grade/user-assign-grade.component';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { UserAssignGradeSectionComponent } from '../user-assign-grade-section/user-assign-grade-section.component';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { DataTablesModule } from 'angular-datatables';
import { UserAssignGradeSubjectComponent } from '../user-assign-grade-subject/user-assign-grade-subject.component';
import { Grade } from 'src/app/theme/shared/model/grade';
import { School } from 'src/app/theme/shared/model/school';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  user : User;
  academicYears : AcademicYear[];
  assignedGrades : GradeCategory[];
  assignedGradeSubjects : Grade[];
  schools : School[];
  assignedGradeSections : SyllabusGradeSubject[];
  academicYearForm : FormGroup;
  academicYearForm1 : FormGroup;
  schoolForm1 : FormGroup;
  schoolForm2 : FormGroup;
  searchClicked : boolean;
  searchClicked1 : boolean;
  searchClicked2 : boolean;
  isCurrentAcademicYear : boolean;
  isCurrentAcademicYear1 : boolean;
  isCurrentAcademicYear2 : boolean;

  constructor(private notifier: NotifierService, 
    private commonService : CommonService,
    private modalService: NgbModal,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService, 
    public commonSharedService : CommonSharedService,
    private location : Location)
    {
      this.user = this.activatedRoute.snapshot.data['user'].data.user;
      this.schools = JSON.parse(JSON.stringify(this.user.schools));
    }

    ngOnInit() 
    {
      this.isCurrentAcademicYear = false;
      this.isCurrentAcademicYear1 = false;
      this.isCurrentAcademicYear2 = false;
      this.searchClicked = false;
      this.searchClicked1 = false;
      this.searchClicked2 = false;
      this.academicYears = [];
      this.assignedGrades = [];
      this.assignedGradeSubjects = [];
      this.assignedGradeSections = [];
      this.academicYearForm = this.formbuilder.group({
        'academicYear': ['']
      });

      this.academicYearForm1 = this.formbuilder.group({
        'academicYear': ['']
      });

      this.schoolForm1 = this.formbuilder.group({
        'school': ['']
      });

      this.schoolForm2 = this.formbuilder.group({
        'school': ['']
      });
      
      if(this.schools.length > 0)
      {
        this.schoolForm1.get("school").setValue(this.schools[0].uuid);
        this.schoolForm2.get("school").setValue(this.schools[0].uuid);
      }
      
      if(this.user?.userType?.code == 'SCHCD' || this.user?.userType?.code == 'SUBHD' || this.user?.userType?.code == 'TECHR')
      {
        this.getAcademicYears();
      }
    }

    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    public userAssignedGradeResult:any = this.commonSharedService.userAssignedGradeListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let schoolUUID = res.schoolUUID;
        let academicYearUUID = res.academicYearUUID;
        let userUUID = res.userUUID;
        this.getUserAssignedGrades(academicYearUUID, userUUID, schoolUUID);
      }
    })

    public userAssignedGradeSubjectResult:any = this.commonSharedService.userAssignedGradeSubjectListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let schoolUUID = res.schoolUUID;
        let academicYearUUID = res.academicYearUUID;
        let userUUID = res.userUUID;
        this.getUserAssignedGradeSubjects(academicYearUUID, userUUID, schoolUUID);
      }
    })

    public userAssignedGradeSectionResult:any = this.commonSharedService.userAssignedGradeSectionListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let academicYearUUID = res.academicYearUUID;
        let schoolUUID = res.schoolUUID;
        let userUUID = res.userUUID;
        this.getUserAssignedGradeSections(academicYearUUID, userUUID, schoolUUID);
      }
    })

    checkCurrentAcademicYear(academicYearUUID : string, checkFor : string)
    {
      if(checkFor == "Grade")
      {
        this.isCurrentAcademicYear = false;
      }
      else if(checkFor == "Subject")
      {
        this.isCurrentAcademicYear2 = false;
      }
      else if(checkFor == "Sections")
      {
        this.isCurrentAcademicYear1 = false;
      }
      let tempAcademicYear : AcademicYear[] = this.academicYears.filter(academicYear => academicYear.uuid == academicYearUUID);
      if(tempAcademicYear.length > 0)
      {
        if(tempAcademicYear[0].isCurrent == 1)
        {
          if(checkFor == "Grade")
          {
            this.isCurrentAcademicYear = true;
          }
          else if(checkFor == "Subject")
          {
            this.isCurrentAcademicYear2 = true;
          }
          else if(checkFor == "Sections")
          {
            this.isCurrentAcademicYear1 = true;
          }
        }
      }
    }

    async getUserAssignedGrades(academicYearUUID : string, userUUID : string, schoolUUID : string) 
    {
      if(userUUID != "" && academicYearUUID != "")
      {
        this.assignedGrades = [];
        this.searchClicked = true;
        try
        {
          let response = await this.userService.getAssignedGrades(userUUID, academicYearUUID, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            $('#tblAssignedGrade').DataTable().clear().destroy();
            this.assignedGrades = response.data.assignedGrades;
            setTimeout(function(){
              $('#tblAssignedGrade').DataTable();
            },500);
            this.searchClicked = false;
            this.checkCurrentAcademicYear(academicYearUUID, "Grade");
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          $('#tblAssignedGrade').DataTable().clear().destroy();
          this.searchClicked = false;
          setTimeout(function(){
            $('#tblAssignedGrade').DataTable();
          },500);
        }
      }
      else
      {
        this.showNotification("info", "Select Academic Year");
      }
    }

    async getUserAssignedGradeSubjects(academicYearUUID : string, userUUID : string, schoolUUID : string) 
    {
      if(userUUID != "" && academicYearUUID != "")
      {
        this.assignedGradeSubjects = [];
        this.searchClicked2 = true;
        try
        {
          let response = await this.userService.getAssignedGradeSubjects(userUUID, academicYearUUID, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            $('#tblAssignedGradeSubject').DataTable().clear().destroy();
            this.assignedGradeSubjects = response.data.assignedSubjects;
            setTimeout(function(){
              $('#tblAssignedGradeSubject').DataTable();
            },500);
            this.searchClicked2 = false;
            this.checkCurrentAcademicYear(academicYearUUID, "Subject");
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          $('#tblAssignedGradeSubject').DataTable().clear().destroy();
          this.searchClicked2 = false;
          setTimeout(function(){
            $('#tblAssignedGradeSubject').DataTable();
          },500);
        }
      }
      else
      {
        this.showNotification("info", "Select Academic Year");
      }
    }

    async getUserAssignedGradeSections(academicYearUUID : string, userUUID : string, schoolUUID : string) 
    {
      if(userUUID != "" && academicYearUUID != "")
      {
        this.assignedGradeSections = [];
        this.searchClicked1 = true;
        try
        {
          let response = await this.userService.getAssignedGradeSections(userUUID, academicYearUUID, schoolUUID, 0).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            $('#tblAssignedGradeSection').DataTable().clear().destroy();
            this.assignedGradeSections = response.data.assignedSections;
            setTimeout(function(){
              $('#tblAssignedGradeSection').DataTable();
            },500);
            this.searchClicked1 = false;
            this.checkCurrentAcademicYear(academicYearUUID, "Sections");
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          $('#tblAssignedGradeSection').DataTable().clear().destroy();
          this.searchClicked1 = false;
          setTimeout(function(){
            $('#tblAssignedGradeSection').DataTable();
          },500);
        }
      }
      else
      {
        this.showNotification("info", "Select Academic Year");
      }
    }

    async getAcademicYears() 
    {
      let response = await this.commonService.getAcademicYears().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicYears = response.data.academicYears;
        for(let i=0;i<this.academicYears.length;i++)
        {
          if(this.academicYears[i].isCurrent == 1)
          {
            this.academicYearForm.get("academicYear").setValue(this.academicYears[i].uuid);
            this.academicYearForm1.get("academicYear").setValue(this.academicYears[i].uuid);
            break;
          }
        }
////Show Assigned Grades
        let academicYearUUID = this.academicYearForm.get("academicYear").value;
        let schoolUUID1 = this.schoolForm1.get("school").value;
        let schoolUUID2 = this.schoolForm2.get("school").value;
        if(this.user.userType.code == "SCHCD")
        {
          this.getUserAssignedGrades(academicYearUUID, this.user.uuid, schoolUUID1);
        }
        else if(this.user.userType.code == "SUBHD")
        {
          this.getUserAssignedGradeSubjects(academicYearUUID, this.user.uuid, schoolUUID1);
        }
        this.getUserAssignedGradeSections(academicYearUUID, this.user.uuid, schoolUUID2);
      }
    }

    addAssignGrades()
    {
      let params = {
        "schoolUUID" : this.user.schools[0].uuid,
        "userUUID" : this.user.uuid
      }
      const dialogRef = this.modalService.open(UserAssignGradeComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    addAssignGradeSubjects()
    {
      let params = {
        "schoolUUID" : this.user.schools[0].uuid,
        "userUUID" : this.user.uuid
      }
      const dialogRef = this.modalService.open(UserAssignGradeSubjectComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    addAssignGradeSections()
    {
      let params = {
        "schoolUUID" : this.user.schools[0]?.uuid,
        "userUUID" : this.user.uuid
      }
      const dialogRef = this.modalService.open(UserAssignGradeSectionComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteAssignedGrade(uuid : string, name : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete assigned grade [' + name + ']?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true
      }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
          
        } 
        else 
        {
          this.showNotification("info", "Please wait...");
          let tempJSON = {"uuid" : uuid};
          let response = await this.userService.deleteUserAssignGrade(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Assigned Grade Deleted");
            this.commonSharedService.userAssignedGradeListObject.next({
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              userUUID : this.user.uuid,
              result : "success"
            });
          }
        }
      });   
    }

    deleteAssignedSubject(uuid : string, gradeName : string, name : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete assigned subject [' + name + '] for grade [' +gradeName+ ']?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true
      }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
          
        } 
        else 
        {
          this.showNotification("info", "Please wait...");
          let tempJSON = {"uuid" : uuid};
          let response = await this.userService.deleteUserAssignGradeSubject(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Assigned Grade Subject Deleted");
            this.commonSharedService.userAssignedGradeSubjectListObject.next({
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              userUUID : this.user.uuid,
              result : "success"
            });
          }
        }
      });   
    }

    deleteAssignedGradeSection(uuid : string, gradeName : string, name : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete assigned section [' + gradeName+" "+name + ']?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true
      }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
          
        } 
        else 
        {
          this.showNotification("info", "Please wait...");
          let tempJSON = {"uuid" : uuid};
          let response = await this.userService.deleteUserAssignGradeSection(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Assigned Grade Section Deleted");
            this.commonSharedService.userAssignedGradeSectionListObject.next({
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              userUUID : this.user.uuid,
              result : "success"
            });
          }
        }
      });
    }

    back()
    {
      this.location.back();
    }
}
