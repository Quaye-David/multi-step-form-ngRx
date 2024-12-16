import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FormData } from '../../models/form-data.interface';

export const FormActions = createActionGroup({
  source: 'Form',
  events: {
    // Load form data
    'Load Form Data': emptyProps(),
    'Load Form Data Success': props<{ formData: FormData }>(),
    'Load Form Data Failure': props<{ error: string }>(),

    // Form validation
    'Validate Form': emptyProps(),
    'Form Valid': emptyProps(),
    'Form Invalid': props<{ errors: string[] }>(),

    // Update form data
    'Update Personal Info': props<{ personalInfo: FormData['personalInfo'] }>(),
    'Update Plan': props<{ plan: FormData['plan'] }>(),
    'Update Addons': props<{ addons: FormData['addons'] }>(),

    // Form completion/reset
    'Complete Form': emptyProps(),
    'Reset Form': emptyProps(),
  }
});