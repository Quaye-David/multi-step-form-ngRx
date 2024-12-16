import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormState } from './form.state';

// Feature selector
export const selectFormState = createFeatureSelector<FormState>('form');

// Data selectors
export const selectFormData = createSelector(
  selectFormState,
  (state) => state.formData
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