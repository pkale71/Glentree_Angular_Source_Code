// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-change-password.component.html',
  styleUrls: ['./auth-change-password.component.scss']
})
export default class AuthChangePasswordComponent {}
