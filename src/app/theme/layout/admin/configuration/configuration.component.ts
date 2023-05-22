// angular import
import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// project import
import { ThemeConfig } from 'src/app/app-config';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationComponent implements OnInit {
  // public props
  styleSelectorToggle: boolean; // open configuration menu
  layoutType: string; // layout type
  rtlLayout: any; // rtl type
  menuFixedLayout: any; // menu/navbar fixed flag
  headerFixedLayout: any; // header fixed flag
  boxLayout: any; // box layout flag
  isColoredIcon: boolean; // menu icon color
  headerBackgroundColor: string; // header background color
  navbarBackgroundColor: string; // navbar background color
  brandBackgroundColor: string; // brand/logo background color
  navBackgroundImage: any; // navbar background image
  menuDropdownIcon: string; // navbar background image
  menuListIcon: string; // navbar background image
  navActiveColor: string;
  navTitleColor: string;
  menuTitleHide: any;
  headerBackColor: string;
  config: any;
  ThemeConfig: any;
  isConfig: boolean;

  // constructor
  constructor(private zone: NgZone, private location: Location, private router: Router) {
    this.config = ThemeConfig;
    this.setThemeLayout();
  }

  // life cycle event
  ngOnInit() {
    this.styleSelectorToggle = false;
    this.layoutType = ThemeConfig.layout_type;
    this.setLayout(this.layoutType);
    this.isColoredIcon = ThemeConfig.isNavIconColor;
    this.changeIconColor(this.isColoredIcon);
    this.headerBackgroundColor = ThemeConfig.headerBackColor;
    this.setHeaderBackground(this.headerBackgroundColor);
    this.navbarBackgroundColor = ThemeConfig.navBackColor;
    this.setNavbarBackground(this.navbarBackgroundColor);
    this.brandBackgroundColor = ThemeConfig.navBrandColor;
    this.setBrandBackground(this.brandBackgroundColor);
    this.navBackgroundImage = ThemeConfig.navBackImage;
    this.setBackgroundImage(this.navBackgroundImage);
    this.rtlLayout = ThemeConfig.isRtlLayout;
    this.changeRtlLayout(this.rtlLayout);
    this.menuFixedLayout = ThemeConfig.isNavFixedLayout;
    if (ThemeConfig.layout === 'vertical') {
      this.changeMenuFixedLayout(this.menuFixedLayout);
    }
    this.headerFixedLayout = ThemeConfig.isHeaderFixedLayout;
    this.changeHeaderFixedLayout(this.headerFixedLayout);
    this.boxLayout = ThemeConfig.isBoxLayout;
    this.changeBoxLayout(this.boxLayout);
    this.menuDropdownIcon = ThemeConfig.navDropdownIcon;
    this.setMenuDropdownIcon(this.menuDropdownIcon);
    this.menuListIcon = ThemeConfig.navListIcon;
    this.setMenuListIcon(this.menuListIcon);
    this.navActiveColor = ThemeConfig.navActiveListColor;
    this.setNavActiveColor(this.navActiveColor);
    this.navTitleColor = ThemeConfig.navListTitleColor;
    this.setNavTitleColor(this.navTitleColor);
    this.menuTitleHide = ThemeConfig.isNavListTitleHide;
    this.changeMenuTitle(this.menuTitleHide);
    if (ThemeConfig.pre_layout !== '' && ThemeConfig.pre_layout !== null) {
      this.setPreBuildLayout(ThemeConfig.pre_layout);
    }
  }

  setThemeLayout() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    // different layout
    switch (current_url) {
      case this.location['_baseHref'] + '/layout/static':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.isNavFixedLayout = false;
        ThemeConfig.isHeaderFixedLayout = false;
        break;
      case this.location['_baseHref'] + '/layout/fixed':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.isNavFixedLayout = true;
        ThemeConfig.isHeaderFixedLayout = true;
        break;
      case this.location['_baseHref'] + '/layout/nav-fixed':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.isNavFixedLayout = true;
        ThemeConfig.isHeaderFixedLayout = false;
        break;
      case this.location['_baseHref'] + '/layout/collapse-menu':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.isCollapseMenu = true;
        break;
      case this.location['_baseHref'] + '/layout/horizontal':
        ThemeConfig.layout = 'horizontal';
        break;
      case this.location['_baseHref'] + '/layout/box':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.isBoxLayout = true;
        ThemeConfig.isCollapseMenu = true;
        break;
      case this.location['_baseHref'] + '/layout/rtl':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.isRtlLayout = true;
        break;
      case this.location['_baseHref'] + '/layout/light':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.layout_type = 'menu-light';
        break;
      case this.location['_baseHref'] + '/layout/dark':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.layout_type = 'dark';
        ThemeConfig.navBackColor = 'navbar-dark';
        ThemeConfig.navBrandColor = 'brand-dark';
        break;
      case this.location['_baseHref'] + '/layout/icon-color':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.layout_type = 'menu-light';
        ThemeConfig.isNavIconColor = true;
        break;
      case this.location['_baseHref'] + '/layout/layout-2':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.pre_layout = 'layout-2';
        break;
      case this.location['_baseHref'] + '/layout/layout-2-2':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.pre_layout = 'layout-2-2';
        break;
      case this.location['_baseHref'] + '/layout/layout-3':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.pre_layout = 'layout-3';
        break;
      case this.location['_baseHref'] + '/layout/layout-4':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.pre_layout = 'layout-4';
        break;
      case this.location['_baseHref'] + '/layout/layout-4-2':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.pre_layout = 'layout-4-2';
        break;
      case this.location['_baseHref'] + '/layout/layout-5h':
        ThemeConfig.layout = 'horizontal';
        ThemeConfig.layout_type = 'menu-light';
        ThemeConfig.isNavIconColor = true;
        ThemeConfig.headerBackColor = 'header-blue';
        break;
      case this.location['_baseHref'] + '/layout/nav-color':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.layout_type = 'menu-light';
        ThemeConfig.isNavIconColor = true;
        ThemeConfig.headerBackColor = 'header-lightblue';
        ThemeConfig.navBrandColor = 'brand-lightblue';
        ThemeConfig.isNavFixedLayout = true;
        ThemeConfig.isHeaderFixedLayout = true;
        break;
      case this.location['_baseHref'] + '/layout/layout-6':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.pre_layout = 'layout-6';
        ThemeConfig.layout_type = 'menu-light';
        ThemeConfig.isNavIconColor = true;
        ThemeConfig.navBrandColor = 'brand-lightblue';
        ThemeConfig.isNavFixedLayout = false;
        ThemeConfig.isHeaderFixedLayout = false;
        ThemeConfig.layout_6_Background = '#23b7e5';
        break;
      case this.location['_baseHref'] + '/layout/layout-8':
        ThemeConfig.layout = 'vertical';
        ThemeConfig.pre_layout = 'layout-8';
        ThemeConfig.layout_type = 'menu-light';
        ThemeConfig.headerBackColor = 'header-lightblue';
        ThemeConfig.navBrandColor = 'brand-lightblue';
        ThemeConfig.isNavFixedLayout = true;
        ThemeConfig.isHeaderFixedLayout = true;
        ThemeConfig.navActiveListColor = 'active-lightblue';
        break;
      default:
        break;
    }
  }

  setPreBuildLayout(pre_layout) {
    if (pre_layout === 'layout-6') {
      document.querySelector('.pcoded-navbar').classList.add('menupos-static');
      this.headerBackColor = ThemeConfig.layout_6_Background;
      this.setHeaderBackColor(this.headerBackColor);
    }

    if (pre_layout !== 'layout-6' && pre_layout !== 'layout-8') {
      this.isConfig = false;
      document.querySelector('.pcoded-navbar').classList.add(pre_layout);
    } else {
      document.querySelector('body').classList.add(pre_layout);
    }
  }

  setHeaderBackColor(color) {
    this.headerBackColor = color;
    (document.querySelector('body') as HTMLElement).style.background = color;
  }

  // change main layout
  setLayout(layout) {
    this.isConfig = true;
    this.setNavbarBackground(ThemeConfig.navBackColor);
    this.setBrandBackground(ThemeConfig.navBrandColor);
    document.querySelector('.pcoded-navbar').classList.remove('menu-light');
    document.querySelector('.pcoded-navbar').classList.remove('menu-dark');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-dark');
    document.querySelector('.pcoded-navbar').classList.remove('brand-dark');
    document.querySelector('body').classList.remove('datta-dark');
    this.setHeaderBackground('header-default');

    this.layoutType = layout;
    if (layout === 'menu-light') {
      this.setNavbarBackground(this.navbarBackgroundColor);
      this.setBrandBackground(this.brandBackgroundColor);
      document.querySelector('.pcoded-navbar').classList.add(layout);
    }
    if (layout === 'dark') {
      document.querySelector('.pcoded-navbar').classList.add('navbar-dark');
      document.querySelector('.pcoded-navbar').classList.add('brand-dark');

      this.setNavbarBackground('navbar-dark');
      this.setBrandBackground('brand-dark');

      if (ThemeConfig.pre_layout !== 'layout-6') {
        this.setHeaderBackground('header-dark');
      }

      document.querySelector('body').classList.add('datta-dark');
    }
    if (layout === 'reset') {
      this.reset();
    }
  }

  reset() {
    document.querySelector('.pcoded-navbar').classList.remove('icon-colored');
    this.ngOnInit();
  }

  setColoredIcon(e) {
    const flag = !!e.target.checked;
    this.changeIconColor(flag);
  }

  changeIconColor(flag) {
    if (flag) {
      document.querySelector('.pcoded-navbar').classList.add('icon-colored');
    } else {
      document.querySelector('.pcoded-navbar').classList.remove('icon-colored');
    }
  }

  setRtlLayout(e) {
    const flag = !!e.target.checked;
    this.changeRtlLayout(flag);
  }

  changeRtlLayout(flag) {
    if (flag) {
      document.querySelector('body').classList.add('datta-rtl');
    } else {
      document.querySelector('body').classList.remove('datta-rtl');
    }
  }

  setMenuFixedLayout(e) {
    const flag = !!e.target.checked;
    this.changeMenuFixedLayout(flag);
  }

  changeMenuFixedLayout(flag) {
    setTimeout(() => {
      if (flag) {
        document.querySelector('.pcoded-navbar').classList.remove('menupos-static');
        // (document.querySelector('#nav-ps-datta') as HTMLElement).style.maxHeight = 'calc(100vh - 70px)';
      } else {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-datta') as HTMLElement).style.maxHeight = '100%';
      }
    }, 100);
  }

  setHeaderFixedLayout(e) {
    const flag = !!e.target.checked;
    this.changeHeaderFixedLayout(flag);
  }

  changeHeaderFixedLayout(flag) {
    if (flag) {
      document.querySelector('.pcoded-header').classList.add('headerpos-fixed');
      document.querySelector('.pcoded-header').classList.add('header-blue');
    } else {
      document.querySelector('.pcoded-header').classList.remove('headerpos-fixed');
    }
  }

  setBoxLayout(e) {
    const flag = !!e.target.checked;
    this.changeBoxLayout(flag);
  }

  changeBoxLayout(flag) {
    if (flag) {
      document.querySelector('body').classList.add('container');
      document.querySelector('body').classList.add('box-layout');
    } else {
      document.querySelector('body').classList.remove('box-layout');
      document.querySelector('body').classList.remove('container');
    }
  }

  hideMenuTitle(e) {
    const flag = !!e.target.checked;
    this.changeMenuTitle(flag);
  }

  changeMenuTitle(flag) {
    if (flag) {
      document.querySelector('.pcoded-navbar').classList.add('caption-hide');
    } else {
      document.querySelector('.pcoded-navbar').classList.remove('caption-hide');
    }
  }

  setHeaderBackground(background) {
    this.headerBackgroundColor = background;
    document.querySelector('.pcoded-header').classList.remove('header-blue');
    document.querySelector('.pcoded-header').classList.remove('header-red');
    document.querySelector('.pcoded-header').classList.remove('header-purple');
    document.querySelector('.pcoded-header').classList.remove('header-lightblue');
    document.querySelector('.pcoded-header').classList.remove('header-dark');
    if (background !== 'header-default') {
      document.querySelector('.pcoded-header').classList.add(background);
    }
  }

  setNavbarBackground(background) {
    this.setBackgroundImage(ThemeConfig.navBackImage);
    this.navbarBackgroundColor = background;
    document.querySelector('.pcoded-navbar').classList.remove('navbar-blue');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-red');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-purple');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-lightblue');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-dark');

    // add default menu brand background color
    document.querySelector('.pcoded-navbar').classList.add('brand-default');
    if (background !== 'navbar-default') {
      document.querySelector('.pcoded-navbar').classList.add(background);
    }
  }

  setBrandBackground(background) {
    this.brandBackgroundColor = background;
    document.querySelector('.pcoded-navbar').classList.remove('brand-default');
    document.querySelector('.pcoded-navbar').classList.remove('brand-blue');
    document.querySelector('.pcoded-navbar').classList.remove('brand-red');
    document.querySelector('.pcoded-navbar').classList.remove('brand-purple');
    document.querySelector('.pcoded-navbar').classList.remove('brand-lightblue');
    document.querySelector('.pcoded-navbar').classList.remove('brand-dark');
    document.querySelector('.pcoded-navbar').classList.add(background);
  }

  setBackgroundImage(image) {
    document.querySelector('.pcoded-navbar').classList.remove('navbar-image-1');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-image-2');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-image-3');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-image-4');
    document.querySelector('.pcoded-navbar').classList.remove('navbar-image-5');
    if (image) {
      this.navBackgroundImage = image;
      document.querySelector('.pcoded-navbar').classList.add(image);
    }
  }

  setMenuDropdownIcon(icon) {
    document.querySelector('.pcoded-navbar').classList.remove('drp-icon-style1');
    document.querySelector('.pcoded-navbar').classList.remove('drp-icon-style2');
    document.querySelector('.pcoded-navbar').classList.remove('drp-icon-style3');
    if (icon !== 'style1') {
      document.querySelector('.pcoded-navbar').classList.add('drp-icon-' + icon);
    }
  }

  setMenuListIcon(icon) {
    document.querySelector('.pcoded-navbar').classList.remove('menu-item-icon-style1');
    document.querySelector('.pcoded-navbar').classList.remove('menu-item-icon-style2');
    document.querySelector('.pcoded-navbar').classList.remove('menu-item-icon-style3');
    document.querySelector('.pcoded-navbar').classList.remove('menu-item-icon-style4');
    document.querySelector('.pcoded-navbar').classList.remove('menu-item-icon-style5');
    document.querySelector('.pcoded-navbar').classList.remove('menu-item-icon-style6');
    if (icon !== 'style1') {
      document.querySelector('.pcoded-navbar').classList.add('menu-item-icon-' + icon);
    }
  }

  setNavActiveColor(style) {
    this.navActiveColor = style;
    document.querySelector('.pcoded-navbar').classList.remove('active-default');
    document.querySelector('.pcoded-navbar').classList.remove('active-blue');
    document.querySelector('.pcoded-navbar').classList.remove('active-red');
    document.querySelector('.pcoded-navbar').classList.remove('active-purple');
    document.querySelector('.pcoded-navbar').classList.remove('active-lightblue');
    document.querySelector('.pcoded-navbar').classList.remove('active-dark');
    if (style !== 'active-default') {
      document.querySelector('.pcoded-navbar').classList.add(style);
    }
  }

  setNavTitleColor(style) {
    this.navTitleColor = style;
    document.querySelector('.pcoded-navbar').classList.remove('title-default');
    document.querySelector('.pcoded-navbar').classList.remove('title-blue');
    document.querySelector('.pcoded-navbar').classList.remove('title-red');
    document.querySelector('.pcoded-navbar').classList.remove('title-purple');
    document.querySelector('.pcoded-navbar').classList.remove('title-lightblue');
    document.querySelector('.pcoded-navbar').classList.remove('title-dark');
    if (style !== 'title-default') {
      document.querySelector('.pcoded-navbar').classList.add(style);
    }
  }
}
