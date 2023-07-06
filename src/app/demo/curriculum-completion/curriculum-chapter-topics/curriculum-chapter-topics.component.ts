import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Grade } from 'src/app/theme/shared/model/grade';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { UserService } from 'src/app/theme/shared/service';
import { User } from 'src/app/theme/shared/model/user';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SchoolGradeSection } from 'src/app/theme/shared/model/school-grade-section';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { DataTablesModule } from 'angular-datatables';
import { UserChapterCompleteStatus } from 'src/app/theme/shared/model/user-chapter-complete-status';
import { SyllabusSubjectChapterTopic } from 'src/app/theme/shared/model/syllabus-subject-chapter-topic';

@Component({
  selector: 'app-curriculum-chapter-topics',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './curriculum-chapter-topics.component.html',
  styleUrls: ['./curriculum-chapter-topics.component.scss']
})
export class CurriculumChapterTopicsComponent {
  chapterCompletionForm : FormGroup[];
  topics : SyllabusSubjectChapterTopic[];
  userChapterCompleteStatuses : UserChapterCompleteStatus[];
  grade : Grade;
  academicYear : AcademicYear;
  chapter : SyllabusGradeSubjectChapter;
  selectedSection : SchoolGradeSection;
  loginUser : User;
  maxDate : any;
  curriculumComplete : string;
  saveClicked : boolean[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    public userService : UserService,
    public commonService : CommonService,
    private location : Location,
    private router : Router,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService)
  {
    this.chapterCompletionForm = [];
    this.academicYear = this.activatedRoute.snapshot.data['currentAcademicYear'].data.currentAcademicYear;
    this.chapter = this.activatedRoute.snapshot.data['subjectChapter'].data.subjectChapter;
    this.topics = this.activatedRoute.snapshot.data['chapterTopics'].data.chapterTopics;
    this.loginUser = this.commonSharedService.loginUser;
    if(localStorage.getItem("SELECTED_SECTION"))
    {
      this.selectedSection = JSON.parse(localStorage.getItem("SELECTED_SECTION"));
    }
    else
    {
      this.selectedSection = null;
    }
    //Chapter-wise or Topic-wise
    this.curriculumComplete = this.loginUser.schools[0]?.curriculumComplete;
    /////
    this.generateDynamicFormArray();

    let curDate = new Date();
    this.maxDate = {day : curDate.getDate(), month: (curDate.getMonth() + 1), year: curDate.getFullYear()};
  }

  ngOnInit() 
  {
    this.saveClicked = [];
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  resetIsCompleted(index : number)
  {
    if(this.chapterCompletionForm[index].get("isCompleted").value == 0)
    {
      this.chapterCompletionForm[index].get("completedOn").setValue(null);
      this.chapterCompletionForm[index].get("completedOn").disable();
    }
    else
    {
      this.chapterCompletionForm[index].get("completedOn").setValue(null);
      this.chapterCompletionForm[index].get("completedOn").enable();
    }
  }

  generateDynamicFormArray()
  {
    for(let i=0;i<this.topics.length;i++)
    {
      this.chapterCompletionForm[i] = this.formbuilder.group({
        uuid:[''],
        academicYear: this.formbuilder.group({ 'uuid': [this.academicYear?.uuid, Validators.required] }),
        grade: this.formbuilder.group({ 'id': [this.chapter?.gradeSubject?.grade?.id, Validators.required] }),
        section: this.formbuilder.group({ 'uuid': [this.selectedSection?.uuid, [Validators.required]] }),
        subject: this.formbuilder.group({ 'uuid': [this.chapter?.gradeSubject?.uuid, Validators.required] }),
        chapter: this.formbuilder.group({ 'uuid': [this.chapter?.uuid, Validators.required] }),
        topic: this.formbuilder.group({ 'uuid': [this.topics[i]?.uuid, Validators.required] }),
        isCompleted: new FormControl(['', Validators.required]),
        completedOn: new FormControl(null)
      });
      this.chapterCompletionForm[i].get("isCompleted").setValue(0);
      this.chapterCompletionForm[i].get("completedOn").disable();
    }

    //Get Filled Data For Curriculum Complete Dates
    if(this.curriculumComplete == "Topic-wise")
    {
      this.getUserChapterCompleteStatuses();
    }
    /////////
  }

  async getUserChapterCompleteStatuses()
  {
    try
    {
      let academicYearUUID : string = this.academicYear?.uuid;
      let userUUID : string = this.loginUser?.uuid;
      let gradeId : number = this.chapter?.gradeSubject?.grade?.id;
      let subjectUUID : string = this.chapter?.gradeSubject?.uuid;
      let sectionUUID : string = this.selectedSection?.uuid;
      let chapterUUID : string = this.chapter?.uuid;
      if(academicYearUUID != "" && userUUID != "" && gradeId > 0 && subjectUUID != "" && sectionUUID != "" && chapterUUID != "")
      {
        this.showNotification("info", "Please Wait While Fetching Records");
        let response = await this.userService.getUserChapterCompleteStatuses(academicYearUUID, userUUID, gradeId, subjectUUID, sectionUUID, chapterUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.userChapterCompleteStatuses = response.data.userChapterCompleteStatuses;
          /////Set Data Into Form
          this.setUserChapterConpleteStatusData();
          ////////
        }
      }
    }
    catch(e)
    {
    }
  }

  setUserChapterConpleteStatusData()
  {
    for(let i=0;i<this.chapterCompletionForm.length;i++)
    {
      let filterChapterCompleteStatuses : UserChapterCompleteStatus[] = this.userChapterCompleteStatuses.filter(chapterStatus => 
        chapterStatus.academicYear.uuid == this.chapterCompletionForm[i].controls["academicYear"].get("uuid").value && 
        chapterStatus.grade.id == this.chapterCompletionForm[i].controls["grade"].get("id").value && 
        chapterStatus.subject.uuid == this.chapterCompletionForm[i].controls["subject"].get("uuid").value && 
        chapterStatus.chapter.uuid == this.chapterCompletionForm[i].controls["chapter"].get("uuid").value && 
        chapterStatus.section.uuid == this.chapterCompletionForm[i].controls["section"].get("uuid").value && 
        chapterStatus.topic.uuid == this.chapterCompletionForm[i].controls["topic"].get("uuid").value
      );

      if(filterChapterCompleteStatuses.length > 0)
      {
        this.chapterCompletionForm[i].get("uuid").setValue(filterChapterCompleteStatuses[0].uuid);
        this.chapterCompletionForm[i].get("isCompleted").setValue(filterChapterCompleteStatuses[0].isCompleted);

        let tempPartDate = (filterChapterCompleteStatuses[0].completedOn).toString().split("-");
        let completedOn : any = null;
        if(tempPartDate.length == 3)
        {
          completedOn = {year : parseInt(tempPartDate[0]), month : parseInt(tempPartDate[1]), day : parseInt(tempPartDate[2])};
          this.chapterCompletionForm[i].get("completedOn").enable();
          this.chapterCompletionForm[i].get("completedOn").setValue(completedOn);
        }
      }
      else
      {
        this.chapterCompletionForm[i].get("uuid").setValue("");
        this.chapterCompletionForm[i].get("isCompleted").setValue(0);
        this.chapterCompletionForm[i].get("completedOn").disable();
        this.chapterCompletionForm[i].get("completedOn").setValue(null);
      }
    }
    this.showNotification("success", "Records Fetching Completed");
  }

  async saveCurriculumCompletion(index : number)
  {
    if(this.chapterCompletionForm[index].valid)
    {
      this.saveClicked[index] = true;
      if(this.chapterCompletionForm[index].get("uuid").value == "" && this.chapterCompletionForm[index].get("isCompleted").value == 1 && this.chapterCompletionForm[index].get("completedOn").value != null)
      {
        let tempJSON = this.chapterCompletionForm[index].value;
        tempJSON.completedOn = tempJSON.completedOn.year + "-" + (tempJSON.completedOn.month < 10 ? '0' + tempJSON.completedOn.month : tempJSON.completedOn.month) + "-" + (tempJSON.completedOn.day < 10 ? '0' + tempJSON.completedOn.day : tempJSON.completedOn.day);
        try
        {
          let response = await this.userService.saveUserChapterCompleteStatus(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Curriculum Completion Saved");
            this.chapterCompletionForm[index].get("uuid").setValue(response.data.uuid);
            this.saveClicked[index] = false;
          }
        }
        catch(e)
        {
          this.showNotification("error", "User Curriculum Completion Not Saved");
          this.saveClicked[index] = false;
        }
      }
      else if(this.chapterCompletionForm[index].get("uuid").value != "" && this.chapterCompletionForm[index].get("isCompleted").value == 1 && this.chapterCompletionForm[index].get("completedOn").value != null)
      {
        let tempJSON = this.chapterCompletionForm[index].value;
        tempJSON.completedOn = tempJSON.completedOn.year + "-" + (tempJSON.completedOn.month < 10 ? '0' + tempJSON.completedOn.month : tempJSON.completedOn.month) + "-" + (tempJSON.completedOn.day < 10 ? '0' + tempJSON.completedOn.day : tempJSON.completedOn.day);
        try
        {
          let response = await this.userService.updateUserChapterCompleteStatus(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Curriculum Completion Updated");
            this.saveClicked[index] = false;
          }
        }
        catch(e)
        {
          this.showNotification("error", "User Curriculum Completion Not Saved");
          this.saveClicked[index] = false;
        }
      }
      else if(this.chapterCompletionForm[index].get("uuid").value != "" && this.chapterCompletionForm[index].get("isCompleted").value == 0)
      {
        try
        {
          let response = await this.userService.deleteUserChapterCompleteStatus(this.chapterCompletionForm[index].value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Curriculum Completion Updated");
            this.chapterCompletionForm[index].get("uuid").setValue("");
            this.saveClicked[index] = false;
          }
        }
        catch(e)
        {
          this.showNotification("error", "User Curriculum Completion Not Saved");
          this.saveClicked[index] = false;
        }
      }
      else
      {
        this.showNotification("info", "Fill Data Properly");
        this.saveClicked[index] = false;
      }
    }
    else
    {
      this.showNotification("info", "Fill Data Properly");
      this.saveClicked[index] = false;
    }
  }

  back()
  {
    this.location.back();
  }
}
