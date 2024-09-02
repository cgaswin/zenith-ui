import { Component, inject } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { loginSchema, LoginFormData } from '../../dto/login.dto';
import { ResponseDTO } from '../../dto/response.dto';
import { LoginResponseDTO } from '../../dto/loginResponse.dto';
import { z } from 'zod';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private loginService = inject(LoginService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting = false;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      console.log('User is already logged in. Redirecting to dashboard.');
      this.router.navigate(['/dashboard']);
    }
  }

  constructor() {
    this.loginForm = this.createLoginForm();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const formValue = this.loginForm.value;

      try {
        const validatedData = loginSchema.parse(formValue);

        this.loginService.login(validatedData).subscribe({
          next: (response: HttpResponse<ResponseDTO<LoginResponseDTO>>) => {
            if (response.body?.success) {
              console.log('Login successful', response.body.data);
              this.authService.setSession(response.body.data);

              this.router.navigate(['/dashboard']).then(
                (navigated: boolean) => {
                  if (navigated) {
                    console.log('Navigation to dashboard successful');
                  } else {
                    console.log('Navigation to dashboard failed');
                  }
                }
              ).catch(err => {
                console.error('Navigation error:', err);
              });
            } else {
              this.errorMessage = response.body?.message || 'Login failed';
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error object:', error);
            this.errorMessage = this.getErrorMessage(error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          this.errorMessage = error.errors.map(e => e.message).join(', ');
        } else {
          this.errorMessage = 'An unexpected error occurred while validating your information.';
        }
        this.isSubmitting = false;
      }
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return 'An error occurred. Please check your internet connection and try again.';
    } else {
      switch (error.status) {
        case 400: return 'Invalid email or password. Please try again.';
        case 401: return 'Invalid credentials. Please check your email and password.';
        case 404: return 'Account not found. Please check your email or sign up.';
        case 500: return 'A server error occurred. Please try again later or contact support.';
        default: return 'An unexpected error occurred. Please try again later or contact support.';
      }
    }
  }
}
