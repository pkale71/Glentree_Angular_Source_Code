import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { School } from 'src/app/theme/shared/model/school';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { Grade } from 'src/app/theme/shared/model/grade';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { ReportUserChapterCompleteStatus } from 'src/app/theme/shared/model/report-user-chapter-complete-status';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { User } from 'src/app/theme/shared/model/user';
import { UserService } from 'src/app/theme/shared/service';
import { ReportService } from 'src/app/theme/shared/service/report.service';
import { SchoolGradeSection } from 'src/app/theme/shared/model/school-grade-section';

@Component({
  selector: 'app-curriculum-completion-report',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './curriculum-completion-report.component.html',
  styleUrls: ['./curriculum-completion-report.component.scss']
})
export class CurriculumCompletionReportComponent {
  searchClicked : boolean;
  academicYearForm : FormGroup;
  schoolForm : FormGroup;
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm : FormGroup;
  chapterCompletionStatuses : ReportUserChapterCompleteStatus[];
  academicYears : AcademicYear[];
  schools : School[];
  grades : Grade[];
  sections : SchoolGradeSection[];
  subjects : SyllabusGradeSubject[];
  chapters : SyllabusGradeSubjectChapter[];
  loginUser : User;
  curriculumComplete : string;
  syllabusId : number;

  constructor(private router : Router,
    private formbuilder : FormBuilder,
    private notifier: NotifierService, 
    private userService : UserService,
    private reportService : ReportService,
    private schoolService : SchoolService,
    private commonService : CommonService,
    private activatedRoute: ActivatedRoute,
    public commonSharedService : CommonSharedService)
  {
    this.academicYears = this.activatedRoute.snapshot.data['academicYears'].data.academicYears;
  }

  ngOnInit() 
  {
    this.chapterCompletionStatuses = [];
    this.loginUser = this.commonSharedService.loginUser;
    this.schools = [];
    this.sections = [];
    this.grades = [];
    this.subjects = [];
    this.chapters = [];
    this.searchClicked = false;

    this.academicYearForm = this.formbuilder.group({
      'academicYear': ['', Validators.required]
    });

    this.schoolForm = this.formbuilder.group({
      'school': ['', Validators.required]
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', Validators.required]
    });

    this.subjectForm = this.formbuilder.group({
      'subject': ['', Validators.required]
    });

    this.chapterForm = this.formbuilder.group({
      'chapter': ['']
    });

    this.getSchools();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSchools()
  {
    this.schools = [];
    if(this.loginUser.userType.code == 'CURHD' || this.loginUser.userType.code == 'HDOFA')
    {
      let response = await this.schoolService.getSchools().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.schools = response.data.schools;
      }
    }
    else if(this.loginUser.userType.code == 'SCHPL' || this.loginUser.userType.code == 'SCHVP' || this.loginUser.userType.code == 'SCHCD' || this.loginUser.userType.code == 'SUBHD')
    {
      this.schools = this.loginUser.schools;
    }
  }

  async getGrades()
  {
    this.grades = [];
    let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
    let schoolUUID : string = this.schoolForm.get("school").value;
    this.curriculumComplete = "";
    this.syllabusId = 0;

    if(academicYearUUID != "" && schoolUUID != "")
    {
  //Get School Related Data
      let filterSchool : School[] = this.schools.filter(school => school.uuid == schoolUUID);
      this.curriculumComplete = filterSchool[0].curriculumComplete;
      this.syllabusId = filterSchool[0].syllabus.id;
      if(this.curriculumComplete == 'Topic-wise')
      {
        this.chapterForm.addValidators(Validators.required);
        this.chapterForm.updateValueAndValidity();
      }
      else
      {
        this.chapterForm.removeValidators(Validators.required);
        this.chapterForm.updateValueAndValidity();
      }
  ///
      if(this.loginUser.userType.code == 'CURHD' || this.loginUser.userType.code == 'HDOFA' || this.loginUser.userType.code == 'SCHPL' || this.loginUser.userType.code == 'SCHVP')
      {
        let response = await this.schoolService.getSchoolGrades(schoolUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.grades = response.data.grades;
          if(this.grades.length > 0)
          {
            this.grades.sort((a,b) => a.id - b.id);
          }
        }
      }
      else if(this.loginUser.userType.code == 'SCHCD')
      {
        let response = await this.userService.getAssignedGrades(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          let gradeCategories : GradeCategory[] = response.data.assignedGrades;
          for(let i=0;i<gradeCategories.length;i++)
          {
            for(let k=0;k<gradeCategories[i]?.userSuperviseGrades.length;k++)
            {
              this.grades.push(gradeCategories[i]?.userSuperviseGrades[k].assignedGrade);
            }
          }
          if(this.grades.length > 0)
          {
            this.grades.sort((a,b) => a.id - b.id);
          }
        }
      }
      else if(this.loginUser.userType.code == 'SUBHD')
      {
        let response = await this.userService.getAssignedGradeSubjects(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.grades = response.data.assignedSubjects;
          if(this.grades.length > 0)
          {
            this.grades.sort((a,b) => a.id - b.id);
          }
        }
      }
    }
  }

  async getSections()
  {
    this.sections = [];
    let gradeId : number = this.gradeForm.get("grade").value;
    let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
    let schoolUUID : string = this.schoolForm.get("school").value;
    if(academicYearUUID != "" && schoolUUID != "" && gradeId > 0)
    {
      let response = await this.schoolService.getSections(academicYearUUID, schoolUUID, gradeId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.sections = response.data.sections;
      }
    }
  }

  async getSubjects()
  {
    this.subjects = [];
    let gradeId : number = this.gradeForm.get("grade").value;
    if(gradeId > 0)
    {
      this.getSections();

      if(this.loginUser.userType.code == 'SCHCD' || this.loginUser.userType.code == 'CURHD' || this.loginUser.userType.code == 'HDOFA' || this.loginUser.userType.code == 'SCHPL' || this.loginUser.userType.code == 'SCHVP')
      {
        let response = await this.commonService.getGradeSubjects(this.syllabusId, gradeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjects = response.data.gradeSubjects;
        }
      }
      else if(this.loginUser.userType.code == 'SUBHD')
      {
        let filterGrades : Grade[] = this.grades.filter(grade => grade.id == gradeId);
        if(filterGrades.length > 0)
        {
          for(let i=0;i<filterGrades.length;i++)
          {
            for(let k=0;k<filterGrades[i].userAssignedSubjects.length;k++)
            {
              this.subjects.push(filterGrades[i].userAssignedSubjects[k].assignedSubject);
            }
          }
        }
      }
    }
  }

  async getCompletionReport()
  {
    if(this.academicYearForm.valid && this.schoolForm.valid && this.gradeForm.valid && this.subjectForm.valid
       && ((this.curriculumComplete == 'Topic-wise' && this.chapterForm.valid) || this.curriculumComplete == 'Chapter-wise'))
    {
      this.chapterCompletionStatuses = [];
      this.searchClicked = true;
      try
      {
        let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
        let gradeId : number = this.gradeForm.get("grade").value;
        let subjectUUID : string = this.subjectForm.get("subject").value;
        let chapterUUID : string = null; 
        if(this.curriculumComplete == 'Topic-wise')
        {
          chapterUUID = this.chapterForm.get("chapter").value;
        }
        let response = await this.reportService.getChapterCompleteStatusReport(academicYearUUID, gradeId, subjectUUID, chapterUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          // $('#tblCurriculumCompleteStatus').DataTable().clear().destroy();
          this.chapterCompletionStatuses = response.data.reportUserChapterCompleteStatuses;
          // setTimeout(function(){
          //   $('#tblCurriculumCompleteStatus').DataTable();
          // },1000);
          this.searchClicked = false;
        }
      }
      catch(e)
      {
        // $('#tblCurriculumCompleteStatus').DataTable().clear().destroy();
        this.searchClicked = false;
        // setTimeout(function(){
        //   $('#tblCurriculumCompleteStatus').DataTable();
        // },1000);
      }
    }
    else
    {
      // $('#tblCurriculumCompleteStatus').DataTable().clear().destroy();
      this.showNotification("warning", "Select All Values");
      this.searchClicked = false;
      // setTimeout(function(){
      //   $('#tblCurriculumCompleteStatus').DataTable();
      // },1000);
    }
  }
}
