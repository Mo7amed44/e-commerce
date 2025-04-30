import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import swal from 'sweetalert';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  // Inject the required services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  // Loading state variable
  isLoading: boolean = false;

  // Login form group initialization with validation
  login: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]], // Email validation
    password: [null, [Validators.required, Validators.pattern(/^[A-z]\w{7,}$/)]] // Password validation
  });

  // Subscription management to handle unsubscriptions (if needed in future)
  private subscriptions: Subscription = new Subscription();

  /**
   * Form submission handler
   */
  submitForm(): void {
    if (this.login.valid) {
      this.isLoading = true;
      console.log(this.login);

      // Call auth service to sign in
      this.authService.signInData(this.login.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('userToken', res.token); // Store token in localStorage
            this.authService.getToken(); // Handle token (e.g., refresh or set in service)
            this.router.navigate(['/home']); // Navigate to home on successful login
          }
          this.isLoading = false;
          console.log(res);
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);

          // Show error alert using SweetAlert
          if (err) {
            swal({
              title: "Are you sure?",
              text: "Password or email are incorrect",
              icon: "warning",
              dangerMode: true
            });
          }
        }
      });
    }
  }

  /**
   * On component destroy, clean up any resources or subscriptions
   */
  ngOnDestroy(): void {
    // In case you want to handle unsubscription here (e.g., for ongoing subscriptions in the future)
    this.subscriptions.unsubscribe();
    console.log('Unsubscribed on destroy');
  }
}
