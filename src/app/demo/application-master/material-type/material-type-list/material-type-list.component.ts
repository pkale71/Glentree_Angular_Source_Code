import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialTypeAddComponent } from '../material-type-add/material-type-add.component';
import { MaterialTypeEditComponent } from '../material-type-edit/material-type-edit.component';
declare var $;

// third party
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { MaterialType } from 'src/app/theme/shared/model/material-type';

@Component({
  selector: 'app-material-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './material-type-list.component.html',
  styleUrls: ['./material-type-list.component.scss']
})
export class MaterialTypeListComponent {
  materialTypes : MaterialType[];

  constructor(private commonService: CommonService, 
    private notifier: NotifierService, 
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    public commonSharedService : CommonSharedService,
    private location : Location,
    private router : Router)
    {
      this.materialTypes = this.activatedRoute.snapshot.data['materialTypes'].data.materialTypes;
    }

    ngOnInit() 
    {
    }

    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    public materialTypeResult:any = this.commonSharedService.materialTypeListObject.subscribe(res =>{
      if(res.result == "success")
      {
        this.getMaterialTypes();
      }
    })

    async getMaterialTypes()
    {
      let response = await this.commonService.getMaterialTypes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblMaterialType').DataTable().clear().destroy();
        this.materialTypes = response.data.materialTypes;
        setTimeout(function(){
          $('#tblMaterialType').DataTable();
        },1000);
        this.modalService.dismissAll();
      }
    }

    addMaterialType()
    {
      const dialogRef = this.modalService.open(MaterialTypeAddComponent, 
      { 
        size: 'lg', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = {};
    }

    editMaterialType(uuid : string)
    {
      let params = {
        "uuid" : uuid
      }
      const dialogRef = this.modalService.open(MaterialTypeEditComponent, 
      { 
        size: 'lg', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteMaterialType(uuid : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete material type?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true
      }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
          
        } 
        else 
        {
          this.showNotification("info", "Please wait...");
          let tempJSON = { "uuid" : uuid };
          try
          {
            let response = await this.commonService.deleteMaterialType(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Material Type Deleted.");
              this.commonSharedService.materialTypeListObject.next({
                result : "success"
              });
            }
          }
          catch(e)
          {
            this.showNotification("error", "Material Type Not Deleted.");
          }
        }
      });
    }
}
