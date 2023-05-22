// angular import
import { Component, NgZone } from '@angular/core';
import { ThemeConfig } from 'src/app/app-config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // public props
  config: any;
  navCollapsed: any;
  navCollapsedMob: boolean;
  windowWidth: number;

  // constructor
  constructor(private zone: NgZone, private location: Location) {
    this.config = ThemeConfig;

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    if (
      current_url === this.location['_baseHref'] + '/layout/collapse-menu' ||
      current_url === this.location['_baseHref'] + '/layout/box'
    ) {
      ThemeConfig.isCollapseMenu = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 992 ? ThemeConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;
  }

  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
