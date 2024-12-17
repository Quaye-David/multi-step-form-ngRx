import { createReducer, on } from '@ngrx/store';
import { FormActions } from './form.actions';
import { FormState, initialFormState } from './form.state';

export const formReducer = createReducer(
  initialFormState,

  on(FormActions.updatePersonalInfo, (state, { personalInfo }): FormState => ({
    ...state,
    formData: {
      ...state.formData,
      personalInfo,
    },
  })),

  on(FormActions.updatePlan, (state, { plan }): FormState => ({
    ...state,
    formData: {
      ...state.formData,
      plan,
    },
  })),

  on(FormActions.updateAddons, (state, { addons }): FormState => ({
    ...state,
    formData: {
      ...state.formData,
      addons,
    },
  })),

  on(FormActions.resetForm, (): FormState => ({
    ...initialFormState,
  }))
);