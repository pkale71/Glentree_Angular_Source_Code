// angular import
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav-logo',
  templateUrl: './nav-logo.component.html',
  styleUrls: ['./nav-logo.component.scss']
})
export class NavLogoComponent {
  // public props
  @Input() navCollapsed: boolean;
  @Output() onNavCollapse = new EventEmitter();
  windowWidth: number;

  // constructor
  constructor() {
    this.windowWidth = window.innerWidth;
  }

  // public method
  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.onNavCollapse.emit();
    }
  }
}
