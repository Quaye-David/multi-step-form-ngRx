// form-data.interface.ts
export interface FormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  plan: {
    type: PlanType;
    isYearly: boolean;
    price: number;
  };
  addons: {
    id: string;
    name: string;
    price: number;
    selected: boolean;
  }[];
}
export type PlanType = '' | 'arcade' | 'advanced' | 'pro' | 'basic' | 'Premium';
