import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Grade } from 'src/app/theme/shared/model/grade';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { UserService } from 'src/app/theme/shared/service';
import { User } from 'src/app/theme/shared/model/user';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-curriculum-grade-subjects',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './curriculum-grade-subjects.component.html',
  styleUrls: ['./curriculum-grade-subjects.component.scss']
})
export class CurriculumGradeSubjectsComponent {
  grades : Grade[];
  loginUser : User;

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    public userService : UserService,
    public commonSharedService : CommonSharedService, 
    public router : Router, 
    private titleService: Title)
    {
      this.titleService.setTitle('CurriculumCompletion' + ' | PROSE EDU :: Curriculum Portal');
      this.grades = this.activatedRoute.snapshot.data['grades'].data.grades;
      this.loginUser = this.commonSharedService.loginUser;
    }
  
    ngOnInit() 
    {
      this.getSubjects(0);
    }

    async getSubjects(index : number)
    {
      if(index < this.grades.length)
      {
        try
        {
          let response = await this.userService.getTeachSubjects(this.loginUser.uuid, this.grades[index].id, this.loginUser.schools[0].uuid).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.grades[index].gradeSubjects = response.data.gradeSubjects;
            index++;
            this.getSubjects(index);
          }
        }
        catch(e)
        {
          index++;
          this.getSubjects(index);
        }
      }
    }

    getChapters(subjectUUID : string)
    {
      this.router.navigateByUrl("/curriculumCompletionChapter/" + subjectUUID);
    }
}
