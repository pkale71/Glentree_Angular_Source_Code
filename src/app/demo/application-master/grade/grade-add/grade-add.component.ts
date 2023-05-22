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

@Component({
  selector: 'app-grade-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-add.component.html',
  styleUrls: ['./grade-add.component.scss']
})
export class GradeAddComponent 
{
  @Input() public modalParams;
  gradeCategories : GradeCategory[];
  addGradeForm: FormGroup;
  gradeCategoryForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

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
    this.isValidForm = true;
    this.saveClicked = false;
    this.gradeCategories = [];

    this.addGradeForm = this.formbuilder.group({
      id:[''],
      name: ['',Validators.required],
      gradeCategory: this.formbuilder.group({ 'id': [''] }),
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });

    this.getGradeCategories();
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

  async saveGrade()
  {
    if(!this.saveClicked)
    {
      if(this.addGradeForm.valid && this.gradeCategoryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        this.addGradeForm.controls["gradeCategory"].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
       
        try
        {
          let response = await this.commonService.saveGrade(this.addGradeForm.value).toPromise();
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
