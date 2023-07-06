import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { IOption, SelectModule } from 'ng-select';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FileType } from 'src/app/theme/shared/model/file-type';

@Component({
  selector: 'app-material-type-add',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './material-type-add.component.html',
  styleUrls: ['./material-type-add.component.scss']
})
export class MaterialTypeAddComponent {
  addMaterialTypeForm: FormGroup;
  fileTypeForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  fileTypes : Array<IOption>;

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService)
  {
    
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.addMaterialTypeForm = this.formbuilder.group({
      uuid:[''],
      name:['', Validators.required],
      fileTypes: ['']
    });

    this.fileTypeForm = this.formbuilder.group({
      'fileType': ['', [Validators.required]]
    });

    this.getFileTypes();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getFileTypes() 
  {
    let tempFileTypes : Array<IOption> = [];
    let response = await this.commonService.getFileTypes().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      let fileTypes :FileType[] = response.data.fileTypes;
      for(let i=0;i<fileTypes.length;i++)
      {
        tempFileTypes.push({
            "value" : fileTypes[i].id.toString(),
            "label": fileTypes[i].name
        })
      }
      this.fileTypes = this.commonSharedService.prepareSelectOptions(tempFileTypes);
    }
  }

  async saveMaterialType()
  {
    if(!this.saveClicked)
    {
      if(this.addMaterialTypeForm.valid && this.fileTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        
        this.addMaterialTypeForm.get("fileTypes").setValue(this.fileTypeForm.get("fileType").value.toString());
        try
        {
          let response = await this.commonService.saveMaterialType(this.addMaterialTypeForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Material Type Saved");
              this.closeModal();
              this.commonSharedService.materialTypeListObject.next({
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
