// step1.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormDataService } from '../../services/form-data.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationButtonsComponent],
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit, OnDestroy {
  personalForm!: FormGroup;
  formSubmitted = false;
  private readonly subscription = new Subscription();
  private isLoadingData = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly formDataService: FormDataService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSavedData();
    this.setupFormValidation();
  }

  private initForm(): void {
    this.personalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?[\d\s-]+$/)
      ]]
    });
  }

  private loadSavedData(): void {
    this.isLoadingData = true;
    this.subscription.add(
      this.formDataService.formData$.subscribe(data => {
        if (data?.personalInfo) {
          this.personalForm.patchValue(data.personalInfo, { emitEvent: false });
        }
        this.isLoadingData = false;
      })
    );
  }

  private setupFormValidation(): void {
    this.subscription.add(
      this.personalForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(() => {
        if (!this.isLoadingData && this.personalForm.valid) {
          this.formDataService.updatePersonalInfo(this.personalForm.value);
        }
      })
    );
  }

  async goNext(): Promise<void> {
    this.formSubmitted = true;

    // Mark all fields as touched
    Object.keys(this.personalForm.controls).forEach(key => {
      const control = this.personalForm.get(key);
      control?.markAsTouched();
    });

    if (this.personalForm.valid) {
      await this.router.navigate(['/multi-step/step2']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}