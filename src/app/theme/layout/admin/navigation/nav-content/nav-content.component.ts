// angular import
import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationItem } from '../navigation';
import { ThemeConfig } from 'src/app/app-config';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/theme/shared/model/user';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit, AfterViewInit {
  // public method
  // version
  title = 'Demo application for version numbering';
  //currentApplicationVersion = environment.appVersion;

  config: any;
  navigation: any;
  prevDisabled: string;
  nextDisabled: string;
  contentWidth: number;
  wrapperWidth: any;
  scrollWidth: any;
  windowWidth: number;
  loginUser : User;

  @Output() onNavCollapsedMob = new EventEmitter();
  @ViewChild('navbarContent', { static: false }) navbarContent: ElementRef;
  @ViewChild('navbarWrapper', { static: false }) navbarWrapper: ElementRef;

  // constructor
  constructor(public nav: NavigationItem, private zone: NgZone, private location: Location, 
    public commonSharedService : CommonSharedService) {
    this.config = ThemeConfig;
    this.windowWidth = window.innerWidth;
    this.navigation = this.nav.get();
    this.prevDisabled = 'disabled';
    this.nextDisabled = '';
    this.scrollWidth = 0;
    this.contentWidth = 0;
    this.loginUser = this.commonSharedService.loginUser;
    
    for(let i=0;i<this.navigation.length;i++)
    {
      let innerChildren1 : any = this.navigation[i].children;
      for(let k=0;k<innerChildren1.length;k++)
      { 
        innerChildren1[k].hidden = this.checkMenuUserCodeByLoginUser(innerChildren1[k].userTypeCode);
   ///Param Setting     
        if(innerChildren1[k].id == "curriculumCompletion")
        {
          innerChildren1[k].param = "/" + this.loginUser?.uuid;
        }
  /////
        let innerChildren2 : any = [];        
        if(innerChildren1[k].children != undefined)
        {
          innerChildren2 = innerChildren1[k].children;
          if(innerChildren2 != undefined)
          {
            for(let l=0;l<innerChildren2.length;l++)
            {
              innerChildren2[l].hidden = this.checkMenuUserCodeByLoginUser(innerChildren2[l].userTypeCode);
            }
          }
        }
      }
    }
  }

  checkMenuUserCodeByLoginUser(userTypeCode : string[])
  {
    let result : boolean = true;
    if(userTypeCode.length > 0)
    {
      for(let i=0;i<userTypeCode.length;i++)
      {
        if(userTypeCode[i] == this.loginUser.userType?.code)
        {
          result = false;
          break;
        }
      }
    }
    else
    {
      result = false;
    }
    return result;
  }

  // life cycle event
  ngOnInit() {    
    if (this.windowWidth < 992) {
      ThemeConfig.layout = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-datta') as HTMLElement).style.maxHeight = '100%';
      }, 500);
    }
  }

  ngAfterViewInit() {
    if (ThemeConfig.layout === 'horizontal') {
      this.contentWidth = this.navbarContent.nativeElement.clientWidth;
      this.wrapperWidth = this.navbarWrapper.nativeElement.clientWidth;
    }
  }

  // public method
  scrollPlus() {
    this.scrollWidth = this.scrollWidth + (this.wrapperWidth - 80);
    if (this.scrollWidth > this.contentWidth - this.wrapperWidth) {
      this.scrollWidth = this.contentWidth - this.wrapperWidth + 80;
      this.nextDisabled = 'disabled';
    }
    this.prevDisabled = '';
    (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
  }

  scrollMinus() {
    this.scrollWidth = this.scrollWidth - this.wrapperWidth;
    if (this.scrollWidth < 0) {
      this.scrollWidth = 0;
      this.prevDisabled = 'disabled';
    }
    this.nextDisabled = '';
    (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
  }

  fireLeave() {
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open')) {
      this.onNavCollapsedMob.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        if (ThemeConfig.layout === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        if (ThemeConfig.layout === 'vertical') {
          up_parent.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        if (ThemeConfig.layout === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }
}
