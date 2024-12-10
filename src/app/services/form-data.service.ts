// form-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormData } from '../models/form-data.interface';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData: FormData = {
    personalInfo: { name: '', email: '', phone: '' },
    plan: { type: '', isYearly: false, price: 0 },
    addons: []
  };

  private formDataSubject = new BehaviorSubject<FormData>(this.formData);
  private formValidSubject = new BehaviorSubject<boolean>(false);

  formData$ = this.formDataSubject.asObservable();
  isFormValid$ = this.formValidSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  updatePersonalInfo(info: FormData['personalInfo']) {
    this.formData.personalInfo = info;
    this.formDataSubject.next(this.formData);
    this.validateForm();
    this.saveToLocalStorage();
  }

  updatePlan(plan: FormData['plan']) {
    this.formData.plan = plan;
    this.formDataSubject.next(this.formData);
    this.validateForm();
    this.saveToLocalStorage();
  }

  updateAddons(addons: FormData['addons']) {
    this.formData.addons = addons;
    this.formDataSubject.next(this.formData);
    this.validateForm();
    this.saveToLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      try {
        this.formData = JSON.parse(savedData);
        this.formDataSubject.next(this.formData);
        this.validateForm();
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('formData', JSON.stringify(this.formData));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }

  clearStorage(): void {
    try {
      localStorage.removeItem('formData');
      this.formData = {
        personalInfo: { name: '', email: '', phone: '' },
        plan: { type: '', isYearly: false, price: 0 },
        addons: []
      };
      this.formDataSubject.next(this.formData);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  private validateForm(): void {
    const { name, email, phone } = this.formData.personalInfo;

    // Validate personal info
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]+$/;

    const isPersonalValid = Boolean(
      name?.length >= 2 &&
      RegExp(emailRegex).exec(email) &&
      RegExp(phoneRegex).exec(phone)
    );

    const isPlanValid = Boolean(this.formData.plan.type);

    this.formValidSubject.next(isPersonalValid && isPlanValid);
  }
}