import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CurriculumUpload } from 'src/app/theme/shared/model/curriculum-upload';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CurriculumService } from 'src/app/theme/shared/service/curriculum.service';
import { CurriculumUploadDeleteComponent } from '../curriculum-upload-delete/curriculum-upload-delete.component';
import { CurriculumUploadAddComponent } from '../curriculum-upload-add/curriculum-upload-add.component';
import { User } from 'src/app/theme/shared/model/user';
import { School } from 'src/app/theme/shared/model/school';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { Grade } from 'src/app/theme/shared/model/grade';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Syllabus } from 'src/app/theme/shared/model/syllabus';
import { SyllabusSubjectChapterTopic } from 'src/app/theme/shared/model/syllabus-subject-chapter-topic';
import { UserService } from 'src/app/theme/shared/service';
import { CurriculumStatusChangeComponent } from '../curriculum-status-change/curriculum-status-change.component';
import { SchoolUserSetting } from 'src/app/theme/shared/model/school-user-setting';
declare var $;

@Component({
  selector: 'app-curriculum-upload-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './curriculum-upload-list.component.html',
  styleUrls: ['./curriculum-upload-list.component.scss']
})
export class CurriculumUploadListComponent {
  curriculumUploads : CurriculumUpload[];
  loginUser : User;
  academicYearForm : FormGroup;
  schoolForm : FormGroup;
  statusForm : FormGroup;
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm : FormGroup;
  topicForm : FormGroup;
  academicYears : AcademicYear[];
  schools : School[];
  grades : Grade[];
  subjects : SyllabusGradeSubject[];
  chapters : SyllabusGradeSubjectChapter[];
  topics : SyllabusSubjectChapterTopic[];
  userCanUpload : boolean = false;
  searchClicked : boolean = false;
  searchGrade : boolean = false;
  searchSubject : boolean = false;
  searchChapter : boolean = false;
  searchTopic : boolean = false;
  isDeleteable : boolean = false;
  canChangeStatus : boolean = false;
  curriculumUploadAs : string;
  isCurrent : number = 0;

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formbuilder: FormBuilder,
    private curriculumService: CurriculumService, 
    public commonSharedService : CommonSharedService,
    private schoolService : SchoolService,
    private commonService : CommonService,
    private userService : UserService,
    private router : Router)
    {
      this.curriculumUploads = [];
      this.loginUser = this.commonSharedService.loginUser;

      this.academicYears = this.activatedRoute.snapshot.data['academicYears'].data.academicYears;
      this.academicYears.unshift({uuid : "", year : "Select Academic Year"});
      this.schools = JSON.parse(JSON.stringify(this.loginUser.schools));
      this.schools.unshift({uuid : "", name : "Select School"});
    }
  
    ngOnInit() 
    {
      this.grades = [];
      this.subjects = [];
      this.chapters = [];
      this.academicYearForm = this.formbuilder.group({
        'academicYear': ['', [Validators.required]]
      });
      
      this.schoolForm = this.formbuilder.group({
        'school': ['', [Validators.required]]
      });

      this.statusForm = this.formbuilder.group({
        'status': ['', [Validators.required]]
      });

      this.gradeForm = this.formbuilder.group({
        'grade': ['', [Validators.required]]
      });
  
      this.subjectForm = this.formbuilder.group({
        'subject': ['', [Validators.required]]
      });
  
      this.chapterForm = this.formbuilder.group({
        'chapter': ['', [Validators.required]]
      });
      
      this.topicForm = this.formbuilder.group({
        'topic': ['']
      });
//Get Local Storage Value
      if(localStorage.getItem("CurriculumUploadFiler"))
      {
        let storageData = JSON.parse(localStorage.getItem("CurriculumUploadFiler"));
        this.academicYearForm.get("academicYear").setValue(storageData.academicYear);
        this.schoolForm.get("school").setValue(storageData.school);
        this.statusForm.get("status").setValue(storageData.status);
        this.getAssignedGrades();
        this.gradeForm.get("grade").setValue(storageData.grade);
        if(storageData.grade)
        {
          this.getAssignedGradeSubjects();
          this.subjectForm.get("subject").setValue(storageData.subject);
        }
        if(storageData.subject)
        {
          this.getChapters();
          this.chapterForm.get("chapter").setValue(storageData.chapter);
        }
        if(this.curriculumUploadAs == 'Topic-wise' && storageData.chapter)
        {
          this.getTopics();
          this.topicForm.get("topic").setValue(storageData.topic);
        }

        this.getCurriculumUploads();
      }
//Check User Can Upload
      this.checkUserCanUpload(0, this.loginUser.schools);
    }

    async checkIsDeleteable()
    {
      this.isDeleteable = false;
      let schoolUUID : string = this.schoolForm.get("school").value;
      let status : string = this.statusForm.get("status").value;
      if(schoolUUID != "" && status != "")
      {
        try
        {
          let response = await this.schoolService.getSchool(schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            let tempSchool : School = response.data.school;
            let tempUploadSettings : SchoolUserSetting[] = tempSchool.schoolUserSetting;
    //Check Can Change Status
            this.checkCanChangeStatus(tempUploadSettings);
    /////
            for(let k=0;k<tempUploadSettings.length;k++)
            {
              if(status == "Uploaded")
              {
                if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && tempUploadSettings[k].canUpload == 1)
                {
                  this.isDeleteable = true;
                }
              }
              else if(status == "Verified")
              {
                if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && tempUploadSettings[k].canVerify == 1)
                {
                  this.isDeleteable = true;
                }
              }
              else if(status == "Published")
              {
                if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && tempUploadSettings[k].canPublish == 1)
                {
                  this.isDeleteable = true;
                }
              }
              else if(status == "Rejected")
              {
                if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && (tempUploadSettings[k].canUpload == 1 || tempUploadSettings[k].canVerify == 1 || tempUploadSettings[k].canPublish == 1))
                {
                  this.isDeleteable = true;
                }
              }
              else
              {
                this.isDeleteable = false;
              }
            }
          }
        }
        catch(e)
        {
          this.isDeleteable = false;
        }
      }
      else
      {
        this.isDeleteable = false;
      }
    }

    async checkCanChangeStatus(tempUploadSettings : SchoolUserSetting[])
    {
      this.canChangeStatus = false;
      let status : string = this.statusForm.get("status").value;
      for(let k=0;k<tempUploadSettings.length;k++)
      {
        if(status == "Uploaded")
        {
          if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && tempUploadSettings[k].canVerify == 1)
          {
            this.canChangeStatus = true;
            break;
          }
        }
        else if(status == "Verified")
        {
          if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && tempUploadSettings[k].canPublish == 1)
          {
            this.canChangeStatus = true;
          }
        }
      }
    }
  
    public curriculumUploadAddResult:any = this.commonSharedService.curriculumUploadListObject.subscribe(res =>{
      if(res.result == "success")
      {
        this.getCurriculumUploads();
      }
    })
  
    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    async getAssignedGrades() 
    {
      this.grades = [];
      let schoolUUID : string = this.schoolForm.get("school").value;
      let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
      if(schoolUUID != "" && academicYearUUID != "" && this.loginUser != null)
      {
        this.isCurrent = this.academicYears.filter(academicYear => academicYear.uuid == academicYearUUID)[0].isCurrent;
        try
        {
          this.searchGrade = true;
    //Check Curriculum Upload As Chapter-wise OR Topic-wise
          this.curriculumUploadAs = this.loginUser.schools.filter(school => school.uuid == schoolUUID)[0]?.curriculumUpload;
          this.topicForm.get("topic").setValue("");
    ///
          if(this.loginUser.userType.code == "SCHCD")
          {
            let response = await this.userService.getAssignedGrades(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              let assignedGrades = response.data.assignedGrades;
              for(let i=0;i<assignedGrades.length;i++)
              {
                for(let k=0;k<assignedGrades[i].userSuperviseGrades.length;k++)
                {
                  this.grades.push(assignedGrades[i].userSuperviseGrades[k].assignedGrade);
                }
              }
              this.searchGrade = false;
            }
          }
          else if(this.loginUser.userType.code == "SUBHD")
          {
            let response = await this.userService.getAssignedGradeSubjects(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.grades = response.data.assignedSubjects;
              this.searchGrade = false;
            }
          }
          else if(this.loginUser.userType.code == "TECHR")
          {
            let response = await this.userService.getTeachGrades(this.loginUser.uuid, schoolUUID).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.grades = response.data.grades;
              this.searchGrade = false;
            }
          }
          else if(this.loginUser.userType.code == "SCHPL" || this.loginUser.userType.code == "SCHVP" || this.loginUser.userType.code == "CURHD" || this.loginUser.userType.code == "HDOFA")
          {
            let response = await this.schoolService.getSchoolGrades(schoolUUID).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.grades = response.data.grades;
              this.searchGrade = false;
            }
          }
        }
        catch(e)
        {
          this.searchGrade = false;
          this.grades = [];
        }
      }
      else
      {
        //this.showNotification("info", "Select Academc Year & School");
      }
    }

    async getAssignedGradeSubjects() 
    {
      this.subjects = [];
      let schoolUUID : string = this.schoolForm.get("school").value;
      let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
      let gradeId : number = this.gradeForm.get("grade").value;
      let syllabus : Syllabus = this.schools.filter(school => school.uuid == schoolUUID)[0]?.syllabus;
      
      if(schoolUUID != "" && academicYearUUID != "" && gradeId > 0 && this.loginUser != null)
      {
        try
        {
          this.searchSubject = true;
          if(this.loginUser.userType.code == "SCHCD")
          {
            let response = await this.commonService.getGradeSubjects(syllabus.id, gradeId).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.subjects = response.data.gradeSubjects;
              this.searchSubject = false;
            }
          }
          else if(this.loginUser.userType.code == "SUBHD")
          {
            let response = await this.userService.getAssignedGradeSubjects(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              let assignedGrades = response.data.assignedSubjects;
              for(let i=0;i<assignedGrades.length;i++)
              {
                for(let k=0;k<assignedGrades[i].userAssignedSubjects.length;k++)
                {
                  this.subjects.push(assignedGrades[i].userAssignedSubjects[k].assignedSubject);
                }
              }
              this.searchSubject = false;
            }
          }
          else if(this.loginUser.userType.code == "TECHR")
          {
            let response = await this.userService.getTeachSubjects(this.loginUser.uuid, gradeId, schoolUUID).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.subjects = response.data.gradeSubjects;
              this.searchSubject = false;
            }
          }
          else if(this.loginUser.userType.code == "SCHPL" || this.loginUser.userType.code == "SCHVP" || this.loginUser.userType.code == "CURHD" || this.loginUser.userType.code == "HDOFA")
          {
            let response = await this.commonService.getGradeSubjects(syllabus.id, gradeId).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.subjects = response.data.gradeSubjects;
              this.searchSubject = false;
            }
          }
        }
        catch(e)
        {
          this.subjects = [];
          this.searchSubject = false;
        }
      }
      else
      {
        //this.showNotification("info", "Select Academc Year, School & Grade");
      }
    }

    async getChapters() 
    {
      this.chapters = [];
      let subjectUUID : string = this.subjectForm.get("subject").value;
      if(subjectUUID && this.loginUser != null)
      {
        try
        {
          this.searchChapter = true;
          let response = await this.commonService.getSubjectChapters(subjectUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.chapters = response.data.subjectChapters;
            this.searchChapter = false;
          }
        }
        catch(e)
        {
          this.chapters = [];
          this.searchChapter = false;
        }
      }
      else
      {
        //this.showNotification("info", "Select Subject");
      }
    }
    
    async getTopics() 
    {
      if(this.curriculumUploadAs == 'Topic-wise')
      {
        this.topics = [];
        let chapterUUID : string = this.chapterForm.get("chapter").value;
        if(chapterUUID && this.loginUser != null)
        {
          try
          {
            this.searchTopic = true;
            let response = await this.commonService.getChapterTopics(chapterUUID).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.topics = response.data.chapterTopics;
              this.searchTopic = false;
            }
          }
          catch(e)
          {
            this.topics = [];
            this.searchTopic = false;
          }
        }
        else
        {
          //this.showNotification("info", "Select Chapter");
        }
      }
      else
      {
        this.topics = [];
      }
    }

    async checkUserCanUpload(i : number, schools : School[])
    {
  //Check User Can Upload
      if(i < schools.length)
      {
        let response = await this.schoolService.getSchool(schools[i].uuid).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          let tempSchool : School = response.data.school;
          let tempUploadSettings = tempSchool.schoolUserSetting;
          for(let k=0;k<tempUploadSettings.length;k++)
          {
            if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && tempUploadSettings[k].canUpload == 1)
            {
              this.userCanUpload = true;
              break;
            }
          }
          if(!this.userCanUpload)
          {
            i++;
            this.checkUserCanUpload(i, schools);
          }
        }
      }
    }
  
    async getCurriculumUploads() 
    {
      let academicYear = this.academicYearForm.get("academicYear").value;
      let school = this.schoolForm.get("school").value;
      let status = this.statusForm.get("status").value;
      let grade = this.gradeForm.get("grade").value;
      let subject = this.subjectForm.get("subject").value;
      let chapter = this.chapterForm.get("chapter").value;
      let topic = this.topicForm.get("topic").value;
      try
      {
        if(academicYear != "" && school != "" && status != "")
        {
//check Is Deleteable
          this.checkIsDeleteable();
          this.searchClicked = true;
//Set Local Storage Variable
          let storageJSON = {
            "academicYear" : academicYear,
            "school" : school,
            "status" : status,
            "grade" : grade,
            "subject" : subject,
            "chapter" : chapter,
            "topic" : topic
          }
          localStorage.setItem("CurriculumUploadFiler", JSON.stringify(storageJSON));
/////
          let response = await this.curriculumService.getCurriculumUploads(academicYear,school,grade,subject,chapter,topic,status).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            $('#tblCurriculum').DataTable().clear().destroy();
            this.curriculumUploads = response.data.curriculumUploads;
            setTimeout(function(){
              $('#tblCurriculum').DataTable();
            },1000);
            this.searchClicked = false;
            this.modalService.dismissAll();
          }
          else
          {
            this.curriculumUploads = [];
            this.searchClicked = false;
            this.modalService.dismissAll();
          }
        }
        else
        {
          this.showNotification("warning", "Select Academc Year, School & Status");
        }
      }
      catch(e)
      {
        this.curriculumUploads = [];
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
    }

    uploadCurriculumUpload()
    {
      const dialogRef = this.modalService.open(CurriculumUploadAddComponent,
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = {};
    }

    detailCurriculumUpload(uuid : string)
    {
      this.router.navigateByUrl("/showCurriculumUpload/" + uuid);
    }

    changeStatus(curriculumUpload : CurriculumUpload)
    {
      let params = {
        "uuid" : curriculumUpload.uuid, 
        "status" : curriculumUpload.status == 'Uploaded'? 'Verify' : curriculumUpload.status == 'Verified' ? 'Publish' : '',
        "fileName" : curriculumUpload.fileName,
        "changedStatus" : curriculumUpload.status == 'Uploaded'? 'Verified' : curriculumUpload.status == 'Verified' ? 'Published' : ''
      }
      const dialogRef = this.modalService.open(CurriculumStatusChangeComponent, 
      { 
        size: 'md', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteCurriculumUpload(uuid)
    {
      let params = {
        "uuid" : uuid
      }
      const dialogRef = this.modalService.open(CurriculumUploadDeleteComponent,
      { 
        size: 'md', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }
}
