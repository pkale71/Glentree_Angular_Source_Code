import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusSubjectChapterTopic } from 'src/app/theme/shared/model/syllabus-subject-chapter-topic';

@Component({
  selector: 'app-topic-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.scss']
})
export class TopicEditComponent {
  @Input() public modalParams;
  topic : SyllabusSubjectChapterTopic;
  editTopicForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  chapterUUID : string;
  chapterName : string;
  topicUUID : string;

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
    this.topicUUID = this.modalParams.uuid;
    /////
    this.isValidForm = true;
    this.saveClicked = false;

    this.editTopicForm = this.formbuilder.group({
      uuid:[''],
      name: ['',Validators.required],
      subjectChapter: this.formbuilder.group({ 'uuid': ['', Validators.required] })
    });
    this.getTopic(this.topicUUID);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getTopic(uuid : string)
  {
    let response = await this.commonService.getChapterTopic(uuid).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.topic = response.data.chapterTopic;
      this.editTopicForm.patchValue(this.topic);
      this.editTopicForm.controls["subjectChapter"].get("uuid").setValue(this.topic.subjectChapter.uuid);
      this.chapterUUID = this.topic.subjectChapter.uuid;
      this.chapterName = this.topic.subjectChapter.name;
    }
  }

  async saveTopic()
  {
    if(!this.saveClicked)
    {
      if(this.chapterUUID != "" && this.editTopicForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        
        try
        {
          let response = await this.commonService.updateChapterTopic(this.editTopicForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Topic Saved");
              this.commonSharedService.topicListObject.next({
                chapterUUID : this.chapterUUID,
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
