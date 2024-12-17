import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FormService } from '../services/form-data.service';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanActivate, OnDestroy {
  private timeoutId?: number;

  constructor(
    private readonly router: Router,
    private readonly formService: FormService
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const formData = await firstValueFrom(
        this.formService.getFormData()
      );

      if (formData?.personalInfo?.name) {
        // Allow landing page to show initially
        this.timeoutId = window.setTimeout(() => {
          this.router.navigate(['/multi-step/step1']);
        }, 2000);
        return true;
      }

      // No form data, allow landing page access
      return true;
    } catch (error) {
      console.error('Form guard error:', error);
      return true;
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}