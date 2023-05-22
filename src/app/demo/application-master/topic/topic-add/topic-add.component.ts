import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

@Component({
  selector: 'app-topic-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './topic-add.component.html',
  styleUrls: ['./topic-add.component.scss']
})
export class TopicAddComponent {
  @Input() public modalParams;
  addTopicForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  chapterUUID : string;
  chapterName : string;

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
    this.chapterName = this.modalParams.chapterName;
    /////
    this.isValidForm = true;
    this.saveClicked = false;

    this.addTopicForm = this.formbuilder.group({
      uuid:[''],
      name: ['',Validators.required],
      subjectChapter: this.formbuilder.group({ 'uuid': [this.chapterUUID, Validators.required] })
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveTopic()
  {
    if(!this.saveClicked)
    {
      if(this.chapterUUID != "" && this.addTopicForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        
        try
        {
          let response = await this.commonService.saveChapterTopic(this.addTopicForm.value).toPromise();
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
