import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

@Component({
  selector: 'app-chapter-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './chapter-add.component.html',
  styleUrls: ['./chapter-add.component.scss']
})
export class ChapterAddComponent {
  @Input() public modalParams;
  addChapterForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  subjectUUID : string;
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
    this.subjectUUID = this.modalParams.uuid;
    this.subjectName = this.modalParams.subjectName;
    /////
    this.isValidForm = true;
    this.saveClicked = false;

    this.addChapterForm = this.formbuilder.group({
      uuid:[''],
      name: ['',Validators.required],
      syllabusGradeSubject: this.formbuilder.group({ 'uuid': [this.subjectUUID, Validators.required] })
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveChapter()
  {
    if(!this.saveClicked)
    {
      if(this.subjectUUID != "" && this.addChapterForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        
        try
        {
          let response = await this.commonService.saveSubjectChapter(this.addChapterForm.value).toPromise();
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
