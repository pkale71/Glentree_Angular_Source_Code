import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { SyllabusSubjectChapterTopic } from 'src/app/theme/shared/model/syllabus-subject-chapter-topic';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
declare var $;

// third party
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { TopicAddComponent } from '../topic-add/topic-add.component';
import { TopicEditComponent } from '../topic-edit/topic-edit.component';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent {
  chapter : SyllabusGradeSubjectChapter;
  topics : SyllabusSubjectChapterTopic[];

  constructor(private commonService: CommonService, 
    private notifier: NotifierService, 
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    public commonSharedService : CommonSharedService,
    private location : Location,
    private router : Router)
    {
      this.chapter = this.activatedRoute.snapshot.data['subjectChapter'].data.subjectChapter;
      this.topics = this.activatedRoute.snapshot.data['chapterTopics'].data.chapterTopics;
    }

    ngOnInit() 
    {
  
    }

    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    public gradeSubjectChapterTopicResult:any = this.commonSharedService.topicListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let chapterUUID = res.chapterUUID;
        this.getTopics(chapterUUID);
      }
    })

    async getTopics(chapterUUID : string)
    {
      let response = await this.commonService.getChapterTopics(chapterUUID).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblTopic').DataTable().clear().destroy();
        this.topics = response.data.chapterTopics;
        setTimeout(function(){
          $('#tblTopic').DataTable();
        },1000);
        this.modalService.dismissAll();
      }
    }

    addTopic()
    {
      let params = {
        "uuid" : this.chapter.uuid,
        "chapterName" : this.chapter.name
      }
      const dialogRef = this.modalService.open(TopicAddComponent, 
      { 
        size: 'md', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    editTopic(uuid : string)
    {
      let params = {
        "uuid" : uuid
      }
      const dialogRef = this.modalService.open(TopicEditComponent, 
      { 
        size: 'md', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteTopic(uuid : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete topic?',
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
            let response = await this.commonService.deleteChapterTopic(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Topic Deleted.");
              this.commonSharedService.topicListObject.next({
                chapterUUID : this.chapter.uuid,
                result : "success"
              });
            }
          }
          catch(e)
          {
            this.showNotification("error", "Topic Not Deleted.");
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
        text: 'Are you sure to ' + (active == 1 ? 'deactive' : 'active') + ' topic?',
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
            let response = await this.commonService.changeChapterTopicStatus(uuid).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Topic Status " + (active == 1 ? 'Deactivated' : 'Activated'));
              this.commonSharedService.topicListObject.next({
                chapterUUID : this.chapter.uuid,
                result : "success"
              });
            }
          }
          catch(e)
          {
            this.showNotification("error", "Topic Status Not Changed.");
          }
        }
      });   
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
      else if(routeName == "Chapter")
      {
        this.router.navigateByUrl("applicationMaster/subject/detail/" + id);
      }
    }

    back()
    {
      this.location.back();
    }
}
