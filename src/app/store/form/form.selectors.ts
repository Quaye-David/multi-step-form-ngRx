import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormState } from './form.state';
import { AppState } from '../index';

// Feature selector
export const selectFormState = createFeatureSelector<FormState>('form');

// Data selectors
export const selectFormData = createSelector(
  selectFormState,
  (state: FormState) => state.formData
);

export const selectIsFormValid = createSelector(
  selectFormState,
  (state: FormState) => {
    const { personalInfo, plan } = state.formData;
    const isPersonalValid = personalInfo.name.length >= 2 &&
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email) &&
                            /^\+?[\d\s-]+$/.test(personalInfo.phone);
    const isPlanValid = Boolean(plan.type);
    return isPersonalValid && isPlanValid;
  }
);

export const selectPersonalInfo = createSelector(
  selectFormData,
  (formData) => formData.personalInfo
);

export const selectPlan = createSelector(
  selectFormData,
  (formData) => formData.plan
);

export const selectAddons = createSelector(
  selectFormData,
  (formData) => formData.addons
);

// Status selectors
export const selectLoading = createSelector(
  selectFormState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectFormState,
  (state) => state.error
);