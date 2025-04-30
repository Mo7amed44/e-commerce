import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly formBuilder = inject(FormBuilder)
  step: number = 1

  forgotPassword: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],

  })
  resetCode: FormGroup = this.formBuilder.group({
    code: [null, [Validators.pattern(/^[0-9]{6}/)]]

  })
  resetPassword: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9@#$%^&*!_.-]{7,}$/)]]

  })

  submitForgotPassword() {
    this.authService.forgetPassword(this.forgotPassword.value).subscribe({
      next: (req) => {
        console.log(req);
        if (req.statusMsg == 'success') {
          this.step = 2

        }
      }
    })
  }
  submitResetCode() {
    const code = this.resetCode.value.code;

    this.authService.VerifyResetCode({ resetCode: code }).subscribe({
      next: (req) => {
        console.log(req);
        if (req.status == 'Success') {
          this.step = 3

        }
      }
    });
  }
  submitResetPassword() {
    const formValue = this.resetPassword.value;

    const payload = {
      email: formValue.email,
      newPassword: formValue.password
    };

    this.authService.ResetPassword(payload).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userToken', res.token);
        this.authService.getToken();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }



}

