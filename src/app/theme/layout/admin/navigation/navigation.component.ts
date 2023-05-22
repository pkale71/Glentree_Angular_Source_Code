// angular import
import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeConfig } from 'src/app/app-config';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // public props
  @Output() onNavCollapse = new EventEmitter();
  @Output() onNavCollapsedMob = new EventEmitter();
  navCollapsed;
  navCollapsedMob;
  windowWidth: number;

  // constructor
  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 992 ? ThemeConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;
  }

  // public method
  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.onNavCollapse.emit();
    }
  }

  navCollapseMob() {
    if (this.windowWidth < 992) {
      this.onNavCollapsedMob.emit();
    }
  }
}
