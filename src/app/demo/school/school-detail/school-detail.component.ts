import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { School } from 'src/app/theme/shared/model/school';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SchoolGradeSectionAddComponent } from '../school-grade-section-add/school-grade-section-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchoolGradeSection } from 'src/app/theme/shared/model/school-grade-section';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-school-detail',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent {
  school : School;
  searchClicked : boolean;
  gradeCategories : GradeCategory[];
  academicYears : AcademicYear[];
  schoolGradeSections : SchoolGradeSection;
  academicYearForm : FormGroup;
  gradeCategoryForm : FormGroup;
  isCurrentAcademicYear : boolean;
  schoolLogo : any;

  constructor(private commonService: CommonService, 
    private notifier: NotifierService, 
    private modalService: NgbModal,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private schoolService: SchoolService, 
    public commonSharedService : CommonSharedService,
    private location : Location)
    {
      this.school = this.activatedRoute.snapshot.data['school'].data.school;
    }
  
    ngOnInit() 
    {
      this.isCurrentAcademicYear = false;
      this.searchClicked = false;
      this.schoolLogo = "";
      this.academicYearForm = this.formbuilder.group({
        'academicYear': ['']
      });

      this.gradeCategoryForm = this.formbuilder.group({
        'gradeCategory': ['']
      });
      
      this.getAcademicYears();
      this.getSchoolLogo(this.school.uuid);
    }

    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    public schoolGradeSectionResult:any = this.commonSharedService.schoolGradeSectionListObject.subscribe(res =>{
      if(res.result == "success")
      {
        this.academicYearForm.get("academicYear").setValue(res.academicYearUUID);
        this.gradeCategoryForm.get("gradeCategory").setValue(res.gradeCategoryId);
        this.getSchoolGradeSections();
      }
    })

    async getSchoolLogo(uuid)
    {
      try
      {
        let response = await this.schoolService.getSchoolLogo(uuid).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.schoolLogo = response.data.logoFile;
        }
      }
      catch(e)
      {}
    }
    
    checkCurrentAcademicYear(academicYearUUID : string)
    {
      this.isCurrentAcademicYear = false;
      let tempAcademicYear : AcademicYear[] = this.academicYears.filter(academicYear => academicYear.uuid == academicYearUUID);
      if(tempAcademicYear.length > 0)
      {
        if(tempAcademicYear[0].isCurrent == 1)
        {
          this.isCurrentAcademicYear = true;
        }
      }
    }

    async getSchoolGradeSections() 
    {
      this.schoolGradeSections = null;
      let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
      let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
      if(academicYearUUID != "" && gradeCategoryId > 0)
      {
        this.searchClicked = true;
        let response = await this.schoolService.getSchoolGradeSections(academicYearUUID, this.school.uuid, gradeCategoryId, 0).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.checkCurrentAcademicYear(academicYearUUID);
          this.schoolGradeSections = response.data.gradeSections;
          this.searchClicked = false;
          this.modalService.dismissAll();
        }
      }
      else
      {
        this.searchClicked = false;
        this.showNotification('info', "Select academic year and grade category");
        this.schoolGradeSections = null;
      }
    }

    async getAcademicYears() 
    {
      let response = await this.commonService.getAcademicYears().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicYears = response.data.academicYears;
  ///set current academicYear
        for(let i=0;i<this.academicYears.length;i++)
        {
          if(this.academicYears[i].isCurrent == 1)
          {
            this.academicYearForm.get("academicYear").setValue(this.academicYears[i].uuid);
            break;
          }
        }
      }
    }

    addSection()
    {
      let params = {
        "uuid" : this.school.uuid
      }
      const dialogRef = this.modalService.open(SchoolGradeSectionAddComponent, 
      { 
        size: 'lg', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteGradeSection(uuid : string, name : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete section [' + name + ']?',
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
          let response = await this.schoolService.deleteSchoolGradeSection(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Grade Section Deleted");
            this.commonSharedService.schoolGradeSectionListObject.next({
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              gradeCategoryId : this.gradeCategoryForm.get("gradeCategory").value,
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
