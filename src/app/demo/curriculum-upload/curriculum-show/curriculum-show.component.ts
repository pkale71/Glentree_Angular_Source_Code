import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from 'src/environments/environment';
import { CurriculumUpload } from 'src/app/theme/shared/model/curriculum-upload';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CurriculumService } from 'src/app/theme/shared/service/curriculum.service';
import { User } from 'src/app/theme/shared/model/user';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var $;

@Component({
  selector: 'app-curriculum-show',
  standalone: true,
  imports: [CommonModule, SharedModule, NgxDocViewerModule],
  templateUrl: './curriculum-show.component.html',
  styleUrls: ['./curriculum-show.component.scss']
})
export class CurriculumShowComponent {
  curriculumUpload : CurriculumUpload;
  loginUser : User;
  videoCurriculumFile : SafeUrl;
  audioCurriculumFile : SafeUrl;
  otherCurriculumFile : SafeUrl;

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService, 
    public commonSharedService : CommonSharedService,
    private router : Router, private location : Location, 
    private domSanitizer : DomSanitizer)
    {
      this.loginUser = this.commonSharedService.loginUser;
      this.curriculumUpload = this.activatedRoute.snapshot.data['curriculumUpload'].data.curriculumUpload;
      let tempPath = environment.apiUrl + "/curriculum/getCurriculumUploadFile/" + this.curriculumUpload.uuid;
      console.log(tempPath)
      if(this.curriculumUpload?.uuid != "" && this.curriculumUpload?.fileName != "")
      {
        let tempFileExtension = this.curriculumUpload.fileName.split(".");
        let fileExt = tempFileExtension[tempFileExtension.length - 1];
        if(fileExt.toLowerCase() == "mp4")
        {
          this.videoCurriculumFile = this.domSanitizer.bypassSecurityTrustResourceUrl(tempPath);
        }
        else if(fileExt.toLowerCase() == "mp3")
        {
          this.audioCurriculumFile = this.domSanitizer.bypassSecurityTrustResourceUrl(tempPath);
        }
        else
        {
          this.otherCurriculumFile = this.domSanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url="+tempPath+"&embedded=true");
        }
      }
    }
  
  ngOnInit() 
  {
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  checkStatus()
  {
    if(this.curriculumUpload)
    {
      if(this.curriculumUpload.status == "Uploaded")
      {
        return "badge bg-primary";
      }
      else if(this.curriculumUpload.status == "Verified")
      {
        return "badge bg-warning";
      }
      else if(this.curriculumUpload.status == "Published")
      {
        return "badge bg-success";
      }
      else if(this.curriculumUpload.status == "Rejected")
      {
        return "badge bg-danger";
      }
    }
  }

  back()
  {
    this.location.back();
  }
}
