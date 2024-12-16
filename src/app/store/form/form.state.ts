// State interface for the form feature
import { FormData } from '../../models/form-data.interface';

export interface FormState {
  formData: FormData;
  loading: boolean;
  error: string | null;
}

// Initial state
export const initialFormState: FormState = {
  formData: {
    personalInfo: { name: '', email: '', phone: '' },
    plan: { type: '', isYearly: false, price: 0 },
    addons: []
  },
  loading: false,
  error: null
};