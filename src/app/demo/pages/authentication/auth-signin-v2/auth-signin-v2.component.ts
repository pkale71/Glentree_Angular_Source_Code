// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-auth-signin-v2',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './auth-signin-v2.component.html',
  styleUrls: ['./auth-signin-v2.component.scss']
})
export default class AuthSigninV2Component implements OnInit {
  // public method
  loginForm!: FormGroup;
  submitted = false;
  error = '';
  signinClicked : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commonService : CommonService,
    private userService: UserService,
    public commonSharedService : CommonSharedService
  ) 
  {  
    localStorage.clear();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function () {
      // toggle the type attribute
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);

      // toggle the icon
      if(this.classList.value == "fa fa-eye-slash")
      {
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }
      else
      {
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async getCurrentAcademicYear()
  {
    let response = await this.commonService.getCurrentAcademicYear().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      localStorage.setItem("currentAcademicYear", JSON.stringify(response.data.currentAcademicYear));
      this.commonSharedService.currentAcademicYear = response.data.currentAcademicYear;
      this.commonSharedService.currentAcademicYearListObject.next({result : "success"});
    }
  }

  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) 
    {
      return;
    }
    this.error = '';
    try
    {
      this.signinClicked = true;
      let response = await this.userService.authenticateUser(this.loginForm.value).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        if(response.user)
        {
          localStorage.setItem("user", JSON.stringify(response.user));
          this.commonSharedService.loginUser = response.user;
          this.signinClicked = false;
          this.getCurrentAcademicYear();
          this.router.navigate(['/dashboard/default']);
        }
        else
        {
          this.error = "Invalid Login";
          this.signinClicked = false;
        }
      }
      else
      {
        this.error = "Invalid Email or Password";
        this.signinClicked = false;
      }
    }
    catch(e)
    {
      this.error = "Login Failed";
      this.signinClicked = false;
      this.router.navigate(['/auth/signin']);
    }
  }
}
