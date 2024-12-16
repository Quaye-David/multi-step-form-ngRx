export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Plan {
  type: string;
  isYearly: boolean;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface FormData {
  personalInfo: PersonalInfo;
  plan: Plan;
  addons: Addon[];
}

export interface FormState {
  formData: FormData;
  loading: boolean;
  error: string | null;
}

export const initialFormState: FormState = {
  formData: {
    personalInfo: { name: '', email: '', phone: '' },
    plan: { type: '', isYearly: false, price: 0 },
    addons: [],
  },
  loading: false,
  error: null,
};