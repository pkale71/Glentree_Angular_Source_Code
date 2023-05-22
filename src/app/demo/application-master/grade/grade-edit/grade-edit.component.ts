import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { Router } from '@angular/router';
import { Grade } from 'src/app/theme/shared/model/grade';

@Component({
  selector: 'app-grade-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-edit.component.html',
  styleUrls: ['./grade-edit.component.scss']
})
export class GradeEditComponent {
  @Input() public modalParams;
  gradeCategories : GradeCategory[];
  grade : Grade;
  editGradeForm: FormGroup;
  gradeCategoryForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  id : number;

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
    
  }

  ngOnInit() 
  {
     //get Modal params
     this.id = this.modalParams.id;
     /////
    this.isValidForm = true;
    this.saveClicked = false;
    this.gradeCategories = [];

    this.editGradeForm = this.formbuilder.group({
      id:[''],
      name: ['',Validators.required],
      gradeCategory: this.formbuilder.group({ 'id': [''] }),
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });

    this.getGradeCategories();
    this.getGrade(this.id);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getGradeCategories() 
  {
    /////////get Grade Categories
    let response = await this.commonService.getGradeCategories().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.gradeCategories = response.data.gradeCategories;
    }
  }

  async getGrade(id : number) 
  {
    let response = await this.commonService.getGrade(id).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.grade = response.data.grade;
      this.editGradeForm.patchValue(this.grade);
      this.gradeCategoryForm.get("gradeCategory").setValue(this.grade.gradeCategory.id);
    }
  }

  async saveGrade()
  {
    if(!this.saveClicked)
    {
      if(this.editGradeForm.valid && this.gradeCategoryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        this.editGradeForm.controls["gradeCategory"].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
       
        try
        {
          let response = await this.commonService.updateGrade(this.editGradeForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Saved");
              this.commonSharedService.gradeListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
        this.saveClicked = false;
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
