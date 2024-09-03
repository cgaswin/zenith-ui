import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { SignupService } from '../../service/signup.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { signupSchema, SignupFormData, AthleteData, CoachData } from "../../dto/signup.dto";
import { ResponseDTO } from '../../dto/response.dto';
import { RegistrationResponseDTO } from '../../dto/registrationResponse.dto';
import { z } from 'zod';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private signupService = inject(SignupService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  signupForm: FormGroup;
  isCoach = false;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor() {
    this.signupForm = this.createSignupForm();
  }

  private createSignupForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      role: ['', Validators.required],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      height: [null],
      weight: [null],
      achievements: this.fb.array([]),
      description: [''],
      image: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onRoleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.isCoach = target.value === 'coach';
    this.toggleFieldsBasedOnRole();
  }

  toggleFieldsBasedOnRole(): void {
    const heightControl = this.signupForm.get('height');
    const weightControl = this.signupForm.get('weight');
    const achievementsArray = this.signupForm.get('achievements') as FormArray;

    if (this.isCoach) {
      heightControl?.disable();
      weightControl?.disable();
      achievementsArray.clear();
      for (let i = 0; i < 3; i++) {
        achievementsArray.push(this.fb.control('', Validators.required));
      }
    } else {
      heightControl?.enable();
      weightControl?.enable();
      achievementsArray.clear();
    }
  }

  get achievements(): FormArray {
    return this.signupForm.get('achievements') as FormArray;
  }

  onFileChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      this.signupForm.patchValue({ image: file });
      this.signupForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const formValue = this.signupForm.value;
      const file = this.signupForm.get('image')?.value;

      try {
        // Validate the form data
        const validatedData = signupSchema.parse(formValue);

        // Create FormData from validated data
        const formData = new FormData();

        // Handle common fields
        const commonFields: (keyof SignupFormData)[] = [
          'name', 'username', 'email', 'password', 'confirmPassword',
          'gender', 'dob', 'role', 'category', 'description'
        ];

        commonFields.forEach(key => {
          if (validatedData[key] !== null && validatedData[key] !== undefined) {
            formData.append(key, validatedData[key]!.toString());
          }
        });

        // Handle image
        if (file instanceof File) {
          formData.append('image', file, file.name);
        }

        // Handle role-specific fields
        if (this.isCoachData(validatedData)) {
          validatedData.achievements.forEach((achievement, index) => {
            formData.append(`achievements[${index}]`, achievement);
          });
        } else if (this.isAthleteData(validatedData)) {
          if (validatedData.height !== null) {
            formData.append('height', validatedData.height.toString());
          }
          if (validatedData.weight !== null) {
            formData.append('weight', validatedData.weight.toString());
          }
        }

        this.signupService.signup(formData).subscribe({
          next: (response: HttpResponse<ResponseDTO<RegistrationResponseDTO>>) => {
            console.log('Full response:', response);
            if (response.body?.success) {
              console.log('Signup successful', response.body.data);
              this.router.navigate(['/login']);
            } else {
              this.errorMessage = response.body?.message || 'Signup failed';
              this.isSubmitting = false;
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error object:', error);
            this.errorMessage = this.getErrorMessage(error);
            this.isSubmitting = false;
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

  private isCoachData(data: SignupFormData): data is CoachData {
    return (data as CoachData).achievements !== undefined;
  }

  private isAthleteData(data: SignupFormData): data is AthleteData {
    return (data as AthleteData).height !== undefined && (data as AthleteData).weight !== undefined;
  }

 

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return 'An error occurred. Please check your internet connection and try again.';
    } else {
      switch (error.status) {
        case 400: return 'Invalid information provided. Please check your details and try again.';
        case 401: return 'Unauthorized access. Please try again or contact support.';
        case 409: return 'An account with this email or username already exists.';
        case 500: return 'A server error occurred. Please try again later or contact support.';
        default: return 'An unexpected error occurred. Please try again later or contact support.';
      }
    }
  }
}