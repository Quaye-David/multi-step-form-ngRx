import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { Router } from '@angular/router';
import { FormService } from '../../services/form-data.service';
import { FormFieldConfig } from '../../models/form-data.interface';

// Move validators to separate utility file
const VALIDATORS = {
  name: (control: AbstractControl): ValidationErrors | null =>
    /^[a-zA-Z\s]{2,}$/.test(control.value) ? null : { invalidName: true },

  phone: (control: AbstractControl): ValidationErrors | null =>
    /^\+?[\d\s-]{10,}$/.test(control.value) ? null : { invalidPhone: true }
};

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationButtonsComponent],
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
})
export class Step1Component implements OnInit, OnDestroy {
  personalForm!: FormGroup;
  formSubmitted = false;
  private readonly subscription = new Subscription();
  private isLoadingData = false;


  // Form field configurations
  readonly formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'e.g. Stephen King',
      validationMessages: {
        required: 'Name is required',
        minlength: 'Name must be at least 2 characters',
        invalidName: 'Name can only contain letters and spaces',
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'e.g. stephenking@lorem.com',
      validationMessages: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
        pattern: 'Please enter a valid email format (e.g. name@example.com)',
      },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'e.g. +1 234 567 890',
      validationMessages: {
        required: 'Phone number is required',
        minlength: 'Phone number must be at least 10 digits',
        invalidPhone: 'Please enter a valid phone number format',
      },
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly formService: FormService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSavedData();
    this.setupFormValidation();
  }

  private initForm(): void {
    this.personalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), VALIDATORS.name]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phone: ['', [Validators.required, Validators.minLength(10), VALIDATORS.phone]]
    });
  }

  private setupFormValidation(): void {
    this.subscription.add(
      this.personalForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(() => {
        if (this.isLoadingData) return;
        this.touchAllFields();
        if (this.personalForm.valid) {
          this.formService.updatePersonalInfo(this.personalForm.value);
        }
      })
    );
  }

  private touchAllFields(): void {
    Object.keys(this.personalForm.controls)
      .forEach(key => this.personalForm.get(key)?.markAsTouched());
  }

  getFieldErrors(fieldName: string): string[] {
    const control = this.personalForm.get(fieldName);
    if (!control?.errors || (!control.touched && !this.formSubmitted)) return [];

    const field = this.formFields.find(f => f.name === fieldName);
    if (!field) return [];

    // Prioritized error checking
    if (control.errors['required']) {
      return [field.validationMessages['required']];
    }
    if (control.errors['minlength']) {
      return [field.validationMessages['minlength']];
    }
    if (control.errors['email']) {
      return [field.validationMessages['email']];
    }
    if (control.errors['pattern']) {
      return [field.validationMessages['pattern']];
    }
    if (control.errors['invalidName']) {
      return [field.validationMessages['invalidName']];
    }
    if (control.errors['invalidPhone']) {
      return [field.validationMessages['invalidPhone']];
    }

    return [];
  }

  private loadSavedData(): void {
    this.isLoadingData = true;
    this.subscription.add(
      this.formService.getFormData().subscribe(data => {
        if (data?.personalInfo) {
          this.personalForm.patchValue(data.personalInfo, { emitEvent: false });
        }
        this.isLoadingData = false;
      })
    );
  }

  async goNext(): Promise<void> {
    this.formSubmitted = true;
    this.touchAllFields();

    if (this.personalForm.valid) {
      this.formService.updatePersonalInfo(this.personalForm.value);
      await this.router.navigate(['/multi-step/step2']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}