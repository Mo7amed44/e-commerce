import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  //Loading state variable
  isLoading: boolean = false;

  //Inject required services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  //Registration form group with validation
  register: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]], // Email validation
    password: [null, [Validators.required, Validators.pattern(/^[A-z]\w{7,}$/)]], // Password validation
    rePassword: [null, [Validators.required]], // Re-password validation
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]] // Phone validation
  }, { validators: this.confirmPassword }); // Custom validator to confirm password match

  /**
   *Form submission handler
   */
  submitForm(): void {
    if (this.register.valid) {
      this.isLoading = true;
      console.log(this.register);

      //Call sign up service to create account
      this.authService.signUpData(this.register.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            // On success, navigate to login page
            this.router.navigate(['/login']);
          }
          this.isLoading = false;
          console.log(res);
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);

          // If account already exists, show a warning message
          if (err.console.error.message === 'Account Already Exists') {
            swal({
              title: "Are you sure?",
              text: "An account with this email already exists.",
              icon: "warning",
              dangerMode: true
            });
          }
        }
      });
    }
  }

  /**
   *Custom validator to confirm password match
   * Returns an error object if passwords don't match
   */
  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    return password === rePassword ? null : { mismatch: true };
  }
}
