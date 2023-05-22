import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ChapterAddComponent } from '../chapter-add/chapter-add.component';
import { ChapterEditComponent } from '../chapter-edit/chapter-edit.component';
declare var $;

// third party
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-chapter-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent {
  subject : SyllabusGradeSubject;
  chapters : SyllabusGradeSubjectChapter[];
  datatable : any;

  constructor(private commonService: CommonService, 
    private notifier: NotifierService, 
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    public commonSharedService : CommonSharedService,
    private location : Location,
    private router : Router)
    {
      this.subject = this.activatedRoute.snapshot.data['gradeSubject'].data.gradeSubject;
      this.chapters = this.activatedRoute.snapshot.data['subjectChapters'].data.subjectChapters;
    }

    ngOnInit() 
    {
    }

    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    public gradeSubjectChapterResult:any = this.commonSharedService.chapterListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let subjectUUID = res.subjectUUID;
        this.getChapters(subjectUUID);
      }
    })

    async getChapters(subjectUUID : string)
    {
      let response = await this.commonService.getSubjectChapters(subjectUUID).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblChapter').DataTable().clear().destroy();
        this.chapters = response.data.subjectChapters;
        setTimeout(function(){
          $('#tblChapter').DataTable();
        },1000);
        this.modalService.dismissAll();
      }
    }

    addChapter()
    {
      let params = {
        "uuid" : this.subject.uuid,
        "subjectName" : this.subject.name
      }
      const dialogRef = this.modalService.open(ChapterAddComponent, 
      { 
        size: 'lg', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    editChapter(uuid : string)
    {
      let params = {
        "uuid" : uuid
      }
      const dialogRef = this.modalService.open(ChapterEditComponent, 
      { 
        size: 'lg', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteChapter(uuid : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete chapter?',
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
          let tempJSON = { "uuid" : uuid };
          try
          {
            let response = await this.commonService.deleteSubjectChapter(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Chapter Deleted.");
              this.commonSharedService.chapterListObject.next({
                subjectUUID : this.subject.uuid,
                result : "success"
              });
            }
          }
          catch(e)
          {
            this.showNotification("error", "Chapter Not Deleted.");
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
        text: 'Are you sure to ' + (active == 1 ? 'deactive' : 'active') + ' chapter?',
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
            let response = await this.commonService.changeSubjectChapterStatus(uuid).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Chapter Status " + (active == 1 ? 'Deactivated' : 'Activated'));
              this.commonSharedService.chapterListObject.next({
                subjectUUID : this.subject.uuid,
                result : "success"
              });
            }
          }
          catch(e)
          {
            this.showNotification("error", "Chapter Status Not Changed.");
          }
        }
      });   
    }

    detailChapter(chapterUUID : string)
    {
      this.router.navigateByUrl("/applicationMaster/chapter/detail/" + chapterUUID);
    }

    gotoRoute(routeName : string, id : string)
    {
      if(routeName == "Grade")
      {
        this.router.navigateByUrl("applicationMaster/grades");
      }
      else if(routeName == "Subject")
      {
        this.router.navigateByUrl("applicationMaster/grade/detail/" + id);
      }
    }

    back()
    {
      this.location.back();
    }
}
