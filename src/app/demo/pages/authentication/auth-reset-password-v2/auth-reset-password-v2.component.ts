// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-reset-password-v2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-reset-password-v2.component.html',
  styleUrls: ['./auth-reset-password-v2.component.scss']
})
export default class AuthResetPasswordV2Component {}
