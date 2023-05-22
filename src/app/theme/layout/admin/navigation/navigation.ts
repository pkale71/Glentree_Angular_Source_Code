import { Injectable } from '@angular/core';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  userTypeCode : string[];
  hidden?: boolean;
  url?: string;
  param?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'collapse',
        icon: 'feather icon-home',
        userTypeCode : [],
        hidden : false,
        children: [
          {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            param: "",
            userTypeCode : [],
            hidden : false
          },
        ]
      },
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        classes: 'nav-item',
        url: '/users',
        param: "",
        icon: 'feather icon-user',
        userTypeCode : ['SUADM','HDOFA'],
        hidden : false
      },
      {
        id: 'applicationMaster',
        title: 'Application Master',
        type: 'collapse',
        icon: 'feather icon-settings',
        userTypeCode : ['SUADM','HDOFA'],
        hidden : false,
        children: [
          {
            id: 'syllabuses',
            title: 'Syllabuses',
            type: 'item',
            url: '/applicationMaster/syllabuses',
            param: "",
            userTypeCode : ['SUADM'],
            hidden : false,
            target: false
          },
          {
            id: 'grades',
            title: 'Grades',
            type: 'item',
            url: '/applicationMaster/grades',
            param: "",
            userTypeCode : ['SUADM','HDOFA'],
            hidden : false,
            target: false
          },
          {
            id: 'academicYears',
            title: 'AcademicYears',
            type: 'item',
            url: '/applicationMaster/academicYears',
            param: "",
            userTypeCode : ['HDOFA'],
            hidden : false,
            target: false
          }
        ]
      },
      {
        id: 'schools',
        title: 'Schools',
        type: 'item',
        classes: 'nav-item',
        url: '/schools',
        param: "",
        icon: 'fa fa-building',
        userTypeCode : ['SUADM','HDOFA'],
        hidden : false
      },
      {
        id: 'curriculumCompletion',
        title: 'Curriculum Completion',
        type: 'item',
        classes: 'nav-item',
        param: "",
        url: '/curriculumCompletion/',
        icon: 'feather icon-calendar',
        userTypeCode : ['SUBHD','TECHR','SCHCD'],
        hidden : false
      },
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() 
  {
    return NavigationItems;
  }
}
