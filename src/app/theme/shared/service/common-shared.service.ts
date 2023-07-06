import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { User } from '../model/user';
import { FormGroup } from '@angular/forms';
import { IOption } from 'ng-select';

@Injectable({
  providedIn: 'root'
})
export class CommonSharedService 
{
    public userListObject = new Subject<any>();
    public schoolListObject = new Subject<any>();
    public academicYearListObject = new Subject<any>();
    public syllabusListObject = new Subject<any>();
    public gradeListObject = new Subject<any>();
    public schoolGradeSectionListObject = new Subject<any>();
    public subjectListObject = new Subject<any>();
    public chapterListObject = new Subject<any>();
    public topicListObject = new Subject<any>();
    public userAssignedGradeListObject = new Subject<any>();
    public userAssignedGradeSectionListObject = new Subject<any>();
    public userAssignedGradeSubjectListObject = new Subject<any>();
    public currentAcademicYearListObject = new Subject<any>();
    public materialTypeListObject = new Subject<any>();
    public curriculumUploadListObject = new Subject<any>();
    public loginUser : User;
    public currentAcademicYear : any;
  
    constructor() 
    { 
        this.loginUser = JSON.parse(localStorage.getItem('user'));
        this.currentAcademicYear = JSON.parse(localStorage.getItem('currentAcademicYear'));
    }

    public confirmPasswordValidator(controlName: string, matchingControlName: string)
    {
            return (formGroup: FormGroup) => {
                const control = formGroup.controls[controlName];
                const matchingControl = formGroup.controls[matchingControlName];
                if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
                    return;
                }
                if (control.value !== matchingControl.value) {
                    matchingControl.setErrors({ confirmedValidator: true });
                } else {
                    matchingControl.setErrors(null);
                }
            }
    }

    public prepareSelectOptions(options: Array<IOption>): Array<IOption> {
        return options.map((option) => ({ value: option.value, label: option.label }));
    }
}
