// form.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { FormActions } from '../store/form/form.actions';
import { selectFormData, selectPlan, selectAddons } from '../store/form/form.selectors';
import { map, Observable } from 'rxjs';
import { FormData } from '../models/form-data.interface';
@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private readonly store: Store<AppState>) {}

  getFormData(): Observable<FormData> {
    return this.store.select(selectFormData);
  }

  getPlan(): Observable<any> {
    return this.store.select(selectPlan);
  }

  getAddons(): Observable<any> {
    return this.store.select(selectAddons);
  }

  updatePersonalInfo(info: FormData['personalInfo']): void {
    this.store.dispatch(FormActions.updatePersonalInfo({ personalInfo: info }));
  }

  updatePlan(plan: FormData['plan']): void {
    this.store.dispatch(FormActions.updatePlan({ plan }));
  }

  updateAddons(addons: FormData['addons']): void {
    this.store.dispatch(FormActions.updateAddons({ addons }));
  }

  resetForm(): void {
    this.store.dispatch(FormActions.resetForm());
  }

  clearStorage(): void {
    try {
      this.resetForm();
      // If you use localStorage or sessionStorage, clear relevant data
      localStorage.removeItem('formData');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

    hasIncompleteForm(): Observable<boolean> {
    return this.getFormData().pipe(
      map(formData => {
        return !!formData?.personalInfo?.name &&
               !formData?.plan?.type; // Check if form is incomplete
      })
    );
  }
}