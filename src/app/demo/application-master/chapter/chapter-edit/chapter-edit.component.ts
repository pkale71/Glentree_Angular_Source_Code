import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';

@Component({
  selector: 'app-chapter-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './chapter-edit.component.html',
  styleUrls: ['./chapter-edit.component.scss']
})
export class ChapterEditComponent 
{
  @Input() public modalParams;
  chapter : SyllabusGradeSubjectChapter;
  editChapterForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  subjectUUID : string;
  chapterUUID : string;
  subjectName : string;

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService)
  {
    
  }

  ngOnInit() 
  {
    //get Modal params
    this.chapterUUID = this.modalParams.uuid;
    /////
    this.isValidForm = true;
    this.saveClicked = false;

    this.editChapterForm = this.formbuilder.group({
      uuid:['', Validators.required],
      name: ['',Validators.required],
      syllabusGradeSubject: this.formbuilder.group({ 'uuid': ['', Validators.required] })
    });
    this.getChapter(this.chapterUUID);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getChapter(uuid : string)
  {
    let response = await this.commonService.getSubjectChapter(uuid).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.chapter = response.data.subjectChapter;
      this.editChapterForm.patchValue(this.chapter);
      this.editChapterForm.controls["syllabusGradeSubject"].get("uuid").setValue(this.chapter.gradeSubject.uuid);
      this.subjectUUID = this.chapter.gradeSubject.uuid;
      this.subjectName = this.chapter.gradeSubject.name;
    }
  }

  async saveChapter()
  {
    if(!this.saveClicked)
    {
      if(this.subjectUUID != "" && this.editChapterForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        
        try
        {
          let response = await this.commonService.updateSubjectChapter(this.editChapterForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Chapter Saved");
              this.commonSharedService.chapterListObject.next({
                subjectUUID : this.subjectUUID,
                result : "success"
              });
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
