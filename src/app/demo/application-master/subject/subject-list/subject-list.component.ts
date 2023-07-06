import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { Grade } from 'src/app/theme/shared/model/grade';
import { Syllabus } from 'src/app/theme/shared/model/syllabus';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import Swal from 'sweetalert2';
import { SubjectAddComponent } from '../subject-add/subject-add.component';
import { SubjectEditComponent } from '../subject-edit/subject-edit.component';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent 
{
  grade : Grade;
  syllabuses : Syllabus[];
  subjects : SyllabusGradeSubject[];
  syllabusForm : FormGroup;
  searchClicked : boolean;

  constructor(private commonService: CommonService, 
    private notifier: NotifierService, 
    private modalService: NgbModal,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public commonSharedService : CommonSharedService,
    private location : Location,
    private router : Router)
    {
      this.grade = this.activatedRoute.snapshot.data['grade'].data.grade;
    }

    ngOnInit() 
    {
      this.subjects = [];
      this.searchClicked = false;
      this.syllabusForm = this.formbuilder.group({
        'syllabus': ['', Validators.required]
      });
      this.getSyllabuses();
      if(localStorage.getItem("SYLLABUS_ID"))
      {
        this.syllabusForm.get("syllabus").setValue(localStorage.getItem("SYLLABUS_ID"));
        this.getSubjects();
      }
    }

    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    public syllabusGradeSubjectResult:any = this.commonSharedService.subjectListObject.subscribe(res =>{
      if(res.result == "success")
      {
        this.syllabusForm.get("syllabus").setValue(res.syllabusId);
        this.getSubjects();
      }
    })
    
    async getSyllabuses() 
    {
      let response = await this.commonService.getSyllabuses().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.syllabuses = response.data.syllabuses;
        if(this.syllabuses.length > 0)
        {
          this.syllabusForm.get("syllabus").setValue(this.syllabuses[0].id);
          this.getSubjects();
        }
      }
    }

    async getSubjects()
    {
      let gradeId : number = this.grade.id;
      let syllabusId : number = this.syllabusForm.get("syllabus").value;
      if(gradeId > 0 && syllabusId > 0)
      {
        this.searchClicked = true;
        try
        {
          let response = await this.commonService.getGradeSubjects(syllabusId, gradeId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.subjects = response.data.gradeSubjects;
            localStorage.setItem("SYLLABUS_ID", syllabusId.toString());
            this.searchClicked = false;
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          this.searchClicked = false;
        }
      }
    }
    
    gotoRoute(routeName : string, id : string)
    {
      if(routeName == "Grade")
      {
        this.router.navigateByUrl("applicationMaster/grades");
      }
    }

    addSubject()
    {
      if(this.syllabusForm.valid)
      {
        let params = {
          "id" : this.grade.id,
          "gradeName" : this.grade.name,
          "syllabusId" : this.syllabusForm.get("syllabus").value
        }
        const dialogRef = this.modalService.open(SubjectAddComponent, 
        { 
          size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
      }
      else
      {
        this.showNotification("warning", "Select Academic Year")
      }
    }

    editSubject(uuid : string)
    {
      let params = {
        "uuid" : uuid,
        "id" : this.grade.id,
        "gradeName" : this.grade.name
      }
      const dialogRef = this.modalService.open(SubjectEditComponent, 
      { 
        size: 'lg', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteSubject(uuid : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete subject?',
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
          try
          {
            let tempJSON = { "uuid" : uuid };
            let response = await this.commonService.deleteGradeSubject(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Subject Deleted.");
              this.commonSharedService.subjectListObject.next({
                syllabusId : this.syllabusForm.get("syllabus").value,
                result : "success"
              });
            }
          }
          catch(e)
          {
            this.showNotification("error", "Subject Not Deleted.");
          }
        }
      });
    }

    changeStatus(uuid : string, active : number)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (active == 1 ? 'deactive' : 'active') + ' subject?',
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
          try
          {
            let response = await this.commonService.changeGradeSubjectStatus(uuid).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Subject Status " + (active == 1 ? 'Deactivated' : 'Activated'));
              this.commonSharedService.subjectListObject.next({
                syllabusId : this.syllabusForm.get("syllabus").value,
                result : "success"
              });
            }
          }
          catch(e)
          {
            this.showNotification("error", "Subject Status Not Changed.");
          }
        }
      });   
    }

    detailSubject(subjectUUId : string)
    {
      this.router.navigateByUrl("/applicationMaster/subject/detail/" + subjectUUId);
    }

    back()
    {
      this.location.back();
    }
}
